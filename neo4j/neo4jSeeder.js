import { faker } from '@faker-js/faker';
import neo4j from 'neo4j-driver';
import { fileURLToPath } from 'url';

class Neo4jService {
    constructor() {
        this.driver = neo4j.driver(
            'bolt://neo4j_db:7687',
            neo4j.auth.basic('neo4j', 'password')
        );
    }

    async query(cypher, params = {}) {
        const session = this.driver.session();
        try {
            return await session.run(cypher, params);
        } finally {
            await session.close();
        }
    }

    async clearDatabase() {
        console.log('Clearing existing database data...');

        // Drop all constraints
        try {
            const constraints = await this.query('SHOW CONSTRAINTS');
            for (const constraint of constraints.records) {
                await this.query(`DROP CONSTRAINT ${constraint.get('name')}`);
            }
            console.log('Dropped existing constraints');
        } catch (error) {
            console.log('No existing constraints to drop');
        }

        // Drop all indexes
        try {
            const indexes = await this.query('SHOW INDEXES');
            for (const index of indexes.records) {
                if (index.get('type') !== 'LOOKUP') { // Don't drop internal indexes
                    await this.query(`DROP INDEX ${index.get('name')}`);
                }
            }
            console.log('Dropped existing indexes');
        } catch (error) {
            console.log('No existing indexes to drop');
        }

        // Delete all nodes and relationships
        await this.query('MATCH (n) DETACH DELETE n');
        console.log('Deleted all nodes and relationships');

        // Verify database is empty
        const result = await this.query('MATCH (n) RETURN count(n) as count');
        const count = result.records[0].get('count').toNumber();

        if (count === 0) {
            console.log('Database cleared successfully');
        } else {
            throw new Error(`Database not properly cleared. ${count} nodes remaining.`);
        }
    }

    async createConstraints() {
        const constraints = [
            'CREATE CONSTRAINT unique_user_email IF NOT EXISTS ON (u:User) ASSERT u.email IS UNIQUE',
            'CREATE CONSTRAINT unique_ingredient_name IF NOT EXISTS ON (i:Ingredient) ASSERT i.name IS UNIQUE',
            'CREATE CONSTRAINT unique_recipe_id IF NOT EXISTS ON (r:Recipe) ASSERT r.id IS UNIQUE',
            'CREATE CONSTRAINT unique_user_prompt_id IF NOT EXISTS ON (up:UserPrompt) ASSERT up.id IS UNIQUE',
            'CREATE CONSTRAINT unique_ai_response_id IF NOT EXISTS ON (ar:AIResponse) ASSERT ar.id IS UNIQUE',
            'CREATE CONSTRAINT unique_instruction_id IF NOT EXISTS ON (ins:Instruction) ASSERT ins.id IS UNIQUE',
            'CREATE CONSTRAINT unique_recipe_modification_id IF NOT EXISTS ON (rm:RecipeModification) ASSERT rm.id IS UNIQUE',
            'CREATE CONSTRAINT unique_modification_response_id IF NOT EXISTS ON (mr:ModificationResponse) ASSERT mr.id IS UNIQUE'
        ];

        for (const constraint of constraints) {
            try {
                await this.query(constraint);
                console.log(`Created constraint: ${constraint}`);
            } catch (error) {
                console.error(`Error creating constraint: ${constraint}`, error);
                throw error;
            }
        }
    }

    async createIndexes() {
        const indexes = [
            'CREATE INDEX recipe_name_idx IF NOT EXISTS FOR (r:Recipe) ON (r.name)',
            'CREATE INDEX recipe_created_idx IF NOT EXISTS FOR (r:Recipe) ON (r.createdAt)',
            'CREATE INDEX user_oauth_idx IF NOT EXISTS FOR (u:User) ON (u.oauthId)',
            'CREATE INDEX ingredient_category_idx IF NOT EXISTS FOR (i:Ingredient) ON (i.category)',
            'CREATE INDEX user_prompt_created_idx IF NOT EXISTS FOR (up:UserPrompt) ON (up.createdAt)',
            'CREATE INDEX ai_response_created_idx IF NOT EXISTS FOR (ar:AIResponse) ON (ar.createdAt)'
        ];

        for (const index of indexes) {
            try {
                await this.query(index);
                console.log(`Created index: ${index}`);
            } catch (error) {
                console.error(`Error creating index: ${index}`, error);
                throw error;
            }
        }
    }

    async createNode(label, properties) {
        // Convert any non-primitive properties to strings
        const processedProps = Object.entries(properties).reduce((acc, [key, value]) => {
            acc[key] = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            return acc;
        }, {});

        const result = await this.query(
            `CREATE (n:${label} $props) RETURN n`,
            { props: { ...processedProps, id: faker.string.uuid(), createdAt: new Date().toISOString() } }
        );
        return result.records[0].get('n');
    }

    async createRelationship(from, to, type, properties = {}) {
        const result = await this.query(
            `
      MATCH (a), (b)
      WHERE id(a) = $fromId AND id(b) = $toId
      CREATE (a)-[r:${type} $props]->(b)
      RETURN r
      `,
            {
                fromId: from.identity,
                toId: to.identity,
                props: properties
            }
        );
        return result.records[0].get('r');
    }
}

async function seedDatabase() {
    const neo4jService = new Neo4jService();

    try {
        console.log('Starting database seeding...');

        // Clear existing data and set up constraints/indexes
        await neo4jService.clearDatabase();
        await neo4jService.createConstraints();
        await neo4jService.createIndexes();

        // Create Users
        console.log('Creating users...');
        const users = await Promise.all([
            ...Array(5).fill().map(() =>
                neo4jService.createNode('User', {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    oauthId: faker.string.uuid(),
                    oauthProvider: faker.helpers.arrayElement(['google', 'facebook', 'github'])
                })
            ),
            // Add test user
            neo4jService.createNode('User', {
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
                neo4jService.createNode('Ingredient', {
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
                neo4jService.createNode('UserPrompt', {
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
                neo4jService.createNode('AIResponse', {
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
                neo4jService.createNode('Recipe', {
                    name: faker.commerce.productName(),
                    prep: {
                        value: faker.number.int({ min: 5, max: 30 }),
                        unit: "minutes"
                    },
                    cook: {
                        value: faker.number.int({ min: 5, max: 30 }),
                        unit: "minutes"
                    },
                    portionSize: faker.number.int({ min: 2, max: 8 }),
                    finalComment: faker.lorem.sentence()
                })
            )
        );

        // Create Instructions
        console.log('Creating instructions...');
        const instructions = await Promise.all(
            recipes.flatMap(recipe =>
                Array(3).fill().map((_, index) =>
                    neo4jService.createNode('Instruction', {
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
                neo4jService.createNode('RecipeModification', {
                    isActive: faker.datatype.boolean()
                })
            )
        );

        // Create Modification Responses
        console.log('Creating modification responses...');
        const modificationResponses = await Promise.all(
            modifications.map(mod =>
                neo4jService.createNode('ModificationResponse', {
                    appliedToRecipe: faker.datatype.boolean()
                })
            )
        );

        // Create Relationships
        console.log('Creating relationships...');
        for (let i = 0; i < users.length; i++) {
            // User writes UserPrompt
            await neo4jService.createRelationship(users[i], userPrompts[i], 'WRITES');

            // UserPrompt has AIResponse
            await neo4jService.createRelationship(userPrompts[i], aiResponses[i], 'HAS_RESPONSE');

            // AIResponse generates Recipe
            await neo4jService.createRelationship(aiResponses[i], recipes[i], 'GENERATES');

            // Recipe has Instructions
            const recipeInstructions = instructions.slice(i * 3, (i + 1) * 3);
            for (const instruction of recipeInstructions) {
                await neo4jService.createRelationship(recipes[i], instruction, 'HAS_INSTRUCTION');
            }

            // Recipe contains Ingredients
            const recipeIngredients = faker.helpers.arrayElements(ingredients, 5);
            for (const ingredient of recipeIngredients) {
                await neo4jService.createRelationship(recipes[i], ingredient, 'CONTAINS', {
                    value: faker.number.int({ min: 1, max: 100 }),
                    unit: faker.helpers.arrayElement(['grams', 'pieces', 'ml', 'tbsp', 'tsp'])
                });
            }

            // Recipe has Modification
            await neo4jService.createRelationship(recipes[i], modifications[i], 'HAS_MODIFICATION');

            // Modification has Response
            await neo4jService.createRelationship(modifications[i], modificationResponses[i], 'HAS_RESPONSE');

            // User saves Recipe
            await neo4jService.createRelationship(users[i], recipes[i], 'SAVES', {
                createdAt: new Date().toISOString()
            });
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