import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

// Use DB_HOST from environment variables, defaulting to localhost if not set.
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD || 'password',
    port: 3306,
    multipleStatements: true,
};

async function setupDatabase() {
    const connection = await mysql.createConnection(dbConfig);

    // Ensure we're using the correct database
    await connection.query('CREATE DATABASE IF NOT EXISTS smartrecipe');
    await connection.query('USE smartrecipe');

    try {
        console.log('Setting up database and users...');

        // Initial database and user setup
        await connection.query(`
      -- Create the database if it doesn't exist
      CREATE DATABASE IF NOT EXISTS smartrecipe;
      USE smartrecipe;
      
      -- Drop existing users
      DROP USER IF EXISTS 'admin'@'${dbConfig.host}';
      DROP USER IF EXISTS 'read_only_user'@'${dbConfig.host}';
      DROP USER IF EXISTS 'restricted_user'@'${dbConfig.host}';
      DROP USER IF EXISTS 'app_user'@'${dbConfig.host}';
      
      -- Create users
      CREATE USER 'admin'@'${dbConfig.host}' IDENTIFIED BY 'admin_password';
      CREATE USER 'read_only_user'@'${dbConfig.host}' IDENTIFIED BY 'read_only_password';
      CREATE USER 'restricted_user'@'${dbConfig.host}' IDENTIFIED BY 'restricted_password';
      CREATE USER 'app_user'@'${dbConfig.host}' IDENTIFIED BY 'app_user_password';
      
      -- Grant privileges
      GRANT ALL PRIVILEGES ON smartrecipe.* TO 'admin'@'${dbConfig.host}';
      GRANT SELECT ON smartrecipe.* TO 'read_only_user'@'${dbConfig.host}';
      
      -- App user privileges
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.users TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.userPrompts TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.aiResponses TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.ingredients TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.instructions TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.modificationResponses TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.recipeIngredients TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.recipeModifications TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.recipes TO 'app_user'@'${dbConfig.host}';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.userRecipes TO 'app_user'@'${dbConfig.host}';
      
      -- Restricted user privileges
      GRANT SELECT ON smartrecipe.users TO 'restricted_user'@'${dbConfig.host}';
      GRANT SELECT ON smartrecipe.userPrompts TO 'restricted_user'@'${dbConfig.host}';
      
      FLUSH PRIVILEGES;
    `);

        console.log('Database and users created successfully');

        // Create function
        await connection.query(`DROP FUNCTION IF EXISTS total_time;`);
        await connection.query(`
      CREATE FUNCTION total_time(prep INT, cook INT) 
      RETURNS INT
      DETERMINISTIC
      RETURN prep + cook;
    `);

        // Create procedure
        await connection.query(`DROP PROCEDURE IF EXISTS get_recipe_by_id;`);
        await connection.query(`
      CREATE PROCEDURE get_recipe_by_id(IN recipe_id INT)
      BEGIN
        SELECT * FROM recipes WHERE id = recipe_id;
      END;
    `);

        // Create trigger
        await connection.query(`DROP TRIGGER IF EXISTS before_recipe_update;`);
        await connection.query(`
      CREATE TRIGGER before_recipe_update
      BEFORE UPDATE ON recipes
      FOR EACH ROW
      SET NEW.updatedAt = NOW();
    `);

        await connection.query(`DROP TRIGGER IF EXISTS recipe_after_insert;`);
        await connection.query(`
      CREATE TRIGGER recipe_after_insert 
      AFTER INSERT ON recipes
      FOR EACH ROW
      BEGIN
          INSERT INTO recipeAuditLogs (recipeId, action, changedData, changedAt)
          VALUES (
              NEW.id, 
              'INSERT', 
              JSON_OBJECT(
                  'name', NEW.name,
                  'portionSize', NEW.portionSize,
                  'aiResponseId', NEW.aiResponseId,
                  'createdAt', NEW.createdAt
              ),
              NOW()
          );
      END
    `);

        // Enable event scheduler
        await connection.query(`SET GLOBAL event_scheduler = ON;`);

        // Drop and recreate view
        await connection.query(`DROP VIEW IF EXISTS recipe_times;`);
        await connection.query(`
      CREATE VIEW recipe_times AS
      SELECT 
        id, 
        name, 
        JSON_EXTRACT(prep, '$.value') + JSON_EXTRACT(cook, '$.value') AS total_recipe_time 
      FROM recipes;
    `);

        // Drop and recreate event
        await connection.query(`DROP EVENT IF EXISTS delete_old_deleted_recipes;`);
        await connection.query(`
      CREATE EVENT delete_old_deleted_recipes
      ON SCHEDULE EVERY 1 DAY
      DO
        DELETE FROM recipes
        WHERE deletedAt IS NOT NULL
        AND deletedAt < NOW() - INTERVAL 1 YEAR;
    `);

        console.log('Database functions, procedures, triggers, views, and events created successfully');

    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function seed() {
    try {
        await setupDatabase();
        console.log('Starting data seeding...');

        // Clean up existing data
        console.log('Cleaning up existing data...');
        await prisma.modificationResponse.deleteMany();
        await prisma.recipeModification.deleteMany();
        await prisma.recipeIngredient.deleteMany();
        await prisma.instruction.deleteMany();
        await prisma.userRecipe.deleteMany();
        await prisma.recipe.deleteMany();
        await prisma.aIResponse.deleteMany();
        await prisma.userPrompt.deleteMany();
        await prisma.ingredient.deleteMany();
        await prisma.user.deleteMany();
        console.log('Existing data cleaned up successfully');

        // Create fake Users
        console.log('Creating users...');
        const createUsers = await prisma.user.createMany({
            data: [...Array(5)].map(() => ({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });

        // Create test user with hashed password
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const testUser = await prisma.user.create({
            data: {
                name: "Test User",
                email: "admin@admin.com",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        const users = await prisma.user.findMany();

        // Create fake Ingredients
        console.log('Creating ingredients...');
        const ingredientCreation = await prisma.ingredient.createMany({
            data: [...Array(10)].map(() => ({
                name: faker.commerce.productName(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
        const ingredients = await prisma.ingredient.findMany();

        // Create fake UserPrompts
        console.log('Creating user prompts...');
        const userPromptsRecords = await prisma.userPrompt.createMany({
            data: users.map((user) => ({
                userId: user.id,
                prompt: {
                    data: {
                        ingredients: [
                            faker.commerce.productName(),
                            faker.commerce.productName(),
                            faker.commerce.productName(),
                        ],
                        willingToShop: faker.datatype.boolean(),
                        comments: faker.lorem.sentence(),
                        dietaryRestrictions: [],
                        cookingTime: faker.helpers.arrayElement(['any', 'short', 'medium', 'long']),
                    },
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
        const userPrompts = await prisma.userPrompt.findMany();

        // Create fake AIResponses
        console.log('Creating AI responses...');
        const aiResponseRecords = await prisma.aIResponse.createMany({
            data: userPrompts.map((userPrompt) => ({
                userPromptId: userPrompt.id,
                response: {
                    data: {
                        recipeId: 0,
                        name: faker.commerce.productName(),
                        time: {
                            prep: { value: faker.number.int({ min: 5, max: 30 }), unit: 'minutes' },
                            cook: { value: faker.number.int({ min: 10, max: 60 }), unit: 'minutes' },
                            total: { value: faker.number.int({ min: 15, max: 90 }), unit: 'minutes' },
                        },
                        portions: faker.number.int({ min: 2, max: 6 }),
                        ingredients: [
                            {
                                name: faker.commerce.productName(),
                                value: faker.number.int({ min: 1, max: 500 }),
                                unit: faker.helpers.arrayElement(['g', 'ml', 'tbsp', 'tsp', 'cups']),
                                comment: faker.lorem.sentence(),
                            },
                        ],
                        instructions: [
                            {
                                part: faker.commerce.productName(),
                                steps: [faker.lorem.sentence()],
                            },
                        ],
                        finalComment: faker.lorem.sentence(),
                    },
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
        const aiResponses = await prisma.aIResponse.findMany();

        // Create fake Recipes
        console.log('Creating recipes...');
        const recipeCreation = await prisma.recipe.createMany({
            data: aiResponses.map((aiResponse) => ({
                aiResponseId: aiResponse.id,
                name: faker.commerce.productName(),
                prep: {
                    value: faker.number.int({ min: 5, max: 30 }),
                    unit: "minutes",
                },
                cook: {
                    value: faker.number.int({ min: 5, max: 30 }),
                    unit: "minutes",
                },
                portionSize: faker.number.int({ min: 2, max: 8 }),
                finalComment: faker.lorem.sentence(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
        const recipes = await prisma.recipe.findMany();

        // Create fake Instructions
        console.log('Creating instructions...');
        const instructions = await prisma.instruction.createMany({
            data: recipes.map((recipe, index) => ({
                recipeId: recipe.id,
                part: index + 1,
                steps: {
                    text: faker.lorem.sentence(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });

        // Create fake RecipeIngredients
        console.log('Creating recipe ingredients...');
        const recipeIngredients = await prisma.recipeIngredient.createMany({
            data: recipes.flatMap((recipe) => {
                const usedIngredients = new Set();

                return [...Array(5)].map(() => {
                    let ingredient;
                    do {
                        ingredient = ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })];
                    } while (usedIngredients.has(ingredient.id));

                    usedIngredients.add(ingredient.id);

                    return {
                        recipeId: recipe.id,
                        ingredientId: ingredient.id,
                        value: faker.number.int({ min: 1, max: 100 }),
                        unit: faker.helpers.arrayElement(['grams', 'cups', 'pieces', 'ml']),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                });
            }),
        });

        // Create fake RecipeModifications
        console.log('Creating recipe modifications...');
        const recipeModificationCreate = await prisma.recipeModification.createMany({
            data: recipes.map((recipe, index) => ({
                recipeId: recipe.id,
                userPromptId: userPrompts[index % userPrompts.length].id,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
        const recipeModifications = await prisma.recipeModification.findMany();

        // Create fake ModificationResponses
        console.log('Creating modification responses...');
        await prisma.modificationResponse.createMany({
            data: aiResponses.map((aiResponse, index) => ({
                aiResponseId: aiResponse.id,
                modificationId: recipeModifications[index % recipeModifications.length].id,
                appliedToRecipe: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });

        // Create UserRecipes
        console.log('Creating user recipes...');
        const userRecipes = await prisma.userRecipe.createMany({
            data: recipes.flatMap(recipe => {
                const selectedUsers = faker.helpers.arrayElements(users, 3);
                return selectedUsers.map(user => ({
                    userId: user.id,
                    recipeId: recipe.id,
                    createdAt: new Date()
                }));
            })
        });

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeder
seed()
    .catch((error) => {
        console.error('Error running seed:', error);
        process.exit(1);
    });
