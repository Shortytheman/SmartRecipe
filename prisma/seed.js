import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);

        // Execute migrations first
        await connection.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS ingredients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                recipe_id INT,
                ingredient_id INT,
                quantity VARCHAR(50),
                unit VARCHAR(50),
                FOREIGN KEY (recipe_id) REFERENCES recipes(id),
                FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
                PRIMARY KEY (recipe_id, ingredient_id)
            );

            CREATE TABLE IF NOT EXISTS instructions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                recipe_id INT,
                step_number INT,
                description TEXT,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id)
            );
        `);

        return connection;
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
};

const seedRecipes = async (connection) => {
    try {
        // Generate 10 recipes
        for (let i = 0; i < 10; i++) {
            // Insert recipe
            const [recipeResult] = await connection.query(
                'INSERT INTO recipes (title, description) VALUES (?, ?)',
                [faker.lorem.words(3), faker.lorem.paragraph()]
            );
            const recipeId = recipeResult.insertId;

            // Generate 3-7 ingredients per recipe
            const ingredientCount = Math.floor(Math.random() * 5) + 3;
            for (let j = 0; j < ingredientCount; j++) {
                // Insert ingredient
                const [ingredientResult] = await connection.query(
                    'INSERT INTO ingredients (name) VALUES (?)',
                    [faker.lorem.word()]
                );
                const ingredientId = ingredientResult.insertId;

                // Link ingredient to recipe
                await connection.query(
                    'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)',
                    [recipeId, ingredientId, Math.floor(Math.random() * 5) + 1, faker.helpers.arrayElement(['cups', 'tbsp', 'tsp', 'g', 'ml'])]
                );
            }

            // Generate 3-6 instructions per recipe
            const instructionCount = Math.floor(Math.random() * 4) + 3;
            for (let k = 0; k < instructionCount; k++) {
                await connection.query(
                    'INSERT INTO instructions (recipe_id, step_number, description) VALUES (?, ?, ?)',
                    [recipeId, k + 1, faker.lorem.sentence()]
                );
            }
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

const seed = async () => {
    let connection;
    try {
        connection = await setupDatabase();
        await seedRecipes(connection);
    } catch (error) {
        console.error('Error running seed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

seed();