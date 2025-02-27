import { faker } from '@faker-js/faker';
import { fileURLToPath } from 'url';
import { Neo4jService } from './neo4jservice.js';


async function seedDatabase() {
    const neo4jService = new Neo4jService();

    try {
        console.log('Starting database seeding...');
        await neo4jService.clearDatabase();
        await neo4jService.createConstraints();
        await neo4jService.createIndexes();

        // Create Users
        console.log('Creating users...');
        const users = await Promise.all([
            ...Array(5).fill().map(() =>
                neo4jService.createModel('User', {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    oauthId: faker.string.uuid(),
                    oauthProvider: faker.helpers.arrayElement(['google', 'facebook', 'github'])
                })
            ),
            // Add test user
            neo4jService.createModel('User', {
                name: 'Test User',
                email: 'admin@admin.com',
                password: 'admin123',
                oauthId: null,
                oauthProvider: null
            })
        ]);

        // Create Ingredients
        console.log('Creating ingredients...');
        const ingredients = await Promise.all([
            ...Array(10).fill().map(() =>
                neo4jService.createModel('Ingredient', {
                    name: faker.commerce.productName().substring(0, 50),
                    category: faker.helpers.arrayElement(['Meat', 'Vegetable', 'Dairy', 'Grain', 'Spice']),
                    unit: faker.helpers.arrayElement(['grams', 'pieces', 'ml', 'tbsp', 'tsp'])
                })
            )
        ]);

        // Create UserPrompts
        console.log('Creating user prompts...');
        const userPrompts = await Promise.all(
            users.map(user =>
                neo4jService.createModel('UserPrompt', {
                    userId: user.id,
                    prompt: {
                        ingredients: [
                            faker.commerce.productName(),
                            faker.commerce.productName(),
                            faker.commerce.productName()
                        ],
                        willingToShop: faker.datatype.boolean(),
                        comments: faker.lorem.sentence(),
                        dietaryRestrictions: [],
                        cookingTime: faker.helpers.arrayElement(['any', 'short', 'medium', 'long'])
                    }
                })
            )
        );

        // Create AIResponses
        console.log('Creating AI responses...');
        const aiResponses = await Promise.all(
            userPrompts.map(prompt =>
                neo4jService.createModel('AIResponse', {
                    response: {
                        name: faker.commerce.productName(),
                        time: {
                            prep: { value: faker.number.int({ min: 5, max: 30 }), unit: 'minutes' },
                            cook: { value: faker.number.int({ min: 10, max: 60 }), unit: 'minutes' }
                        },
                        portions: faker.number.int({ min: 2, max: 6 }),
                        finalComment: faker.lorem.sentence()
                    }
                })
            )
        );

        // Create Recipes
        console.log('Creating recipes...');
        const recipes = await Promise.all(
            aiResponses.map(response => 
                neo4jService.createModel('Recipe', {
                    aiResponseId: response.id,
                    name: faker.commerce.productName(),
                    prepTime: faker.number.int({ min: 5, max: 30 }),
                    prepUnit: 'minutes',
                    cookTime: faker.number.int({ min: 5, max: 30 }),
                    cookUnit: 'minutes',
                    portions: faker.number.int({ min: 2, max: 8 }),
                    final_comment: faker.lorem.sentence(),
                    ingredients: ingredients.slice(0, 3).map(ing => ({
                        name: ing.name,
                        value: faker.number.int({ min: 1, max: 100 }),
                        unit: faker.helpers.arrayElement(['grams', 'pieces', 'ml']),
                        comment: faker.lorem.sentence()
                    })),
                    instructions: Array(3).fill().map((_, index) => ({
                        part: index + 1,
                        steps: faker.lorem.paragraph()
                    }))
                })
            )
        );

        // Create Instructions
        console.log('Creating instructions...');
        const instructions = await Promise.all(
            recipes.flatMap(recipe =>
                Array(3).fill().map((_, index) =>
                    neo4jService.createModel('Instruction', {
                        part: index + 1,
                        steps: {
                            text: faker.lorem.sentence()
                        }
                    })
                )
            )
        );

        // Create Recipe Modifications
        console.log('Creating recipe modifications...');
        const modifications = await Promise.all(
            recipes.map(recipe =>
                neo4jService.createModel('RecipeModification', {
                    isActive: faker.datatype.boolean()
                })
            )
        );

        // Create Modification Responses
        console.log('Creating modification responses...');
        const modificationResponses = await Promise.all(
            modifications.map(mod =>
                neo4jService.createModel('ModificationResponse', {
                    appliedToRecipe: faker.datatype.boolean()
                })
            )
        );

        // Create Relationships
        console.log('Creating user-recipe chains...');
        for (let i = 0; i < users.length; i++) {
            await neo4jService.createRelationship(users[i], userPrompts[i], 'WRITES');
            await neo4jService.createRelationship(userPrompts[i], aiResponses[i], 'HAS_RESPONSE');
            
            await neo4jService.createRelationship(users[i], recipes[i], 'SAVES', {
                createdAt: new Date().toISOString()
            });
        }

        // Create Recipe -> Modification -> ModificationResponse chains
        console.log('Creating modification chains...');
        for (let i = 0; i < recipes.length; i++) {
            await neo4jService.createRelationship(recipes[i], modifications[i], 'HAS_MODIFICATION');
            await neo4jService.createRelationship(modifications[i], modificationResponses[i], 'HAS_RESPONSE');
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await neo4jService.driver.close();
    }
}

// Example queries for testing
const exampleQueries = {
    getUserRecipes: `
    MATCH (u:User)-[:SAVES]->(r:Recipe)
    WHERE u.email = $email
    RETURN r
  `,

    getRecipeWithIngredients: `
    MATCH (r:Recipe)-[rel:CONTAINS]->(i:Ingredient)
    WHERE r.id = $recipeId
    RETURN r, collect({ingredient: i, quantity: rel.value, unit: rel.unit}) as ingredients
  `,

    getRecipeWithInstructions: `
    MATCH (r:Recipe)-[:HAS_INSTRUCTION]->(i:Instruction)
    WHERE r.id = $recipeId
    RETURN r, collect(i) as instructions ORDER BY i.part
  `,

    getUserPromptChain: `
    MATCH (u:User)-[:WRITES]->(up:UserPrompt)-[:HAS_RESPONSE]->(ar:AIResponse)-[:GENERATES]->(r:Recipe)
    WHERE u.email = $email
    RETURN u, up, ar, r
  `
};

// Execute the seeder if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log('Starting the Neo4j database seeder...');
    seedDatabase()
        .then(() => {
            console.log('Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error during seeding:', error);
            process.exit(1);
        });
}

export { seedDatabase, exampleQueries };