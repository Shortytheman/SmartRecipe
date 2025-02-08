// mongoSeeder.js
import mongoose from 'mongoose';
import faker from 'faker';
import models from './mongoSchema.js';

const DATABASE_NAME = 'smartrecipe';
const MONGODB_URI = `mongodb://localhost:27017/${DATABASE_NAME}`;

const seedMongoDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB - Database: ${DATABASE_NAME}`);

    // Drop the database if it exists
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

    // Clear existing data (as an extra precaution)
    const modelCollections = Object.values(models);
    for (const collection of modelCollections) {
      await collection.deleteMany({});
    }
    console.log('Collections cleared');

    // Seed Users
    const users = Array.from({ length: 10 }).map(() => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      oauthId: faker.datatype.uuid(),
      oauthProvider: faker.random.arrayElement(['google', 'facebook', 'github']),
    }));
    const insertedUsers = await models.User.insertMany(users);
    console.log('Users seeded');

    // Seed Ingredients
      const seedIngredients = (count) => {
          const uniqueNames = new Set();
          const ingredients = [];

          // Predefined list of common ingredients to mix with faker
          const commonIngredients = [
              'Salt', 'Pepper', 'Olive Oil', 'Garlic', 'Onion',
              'Tomato', 'Basil', 'Oregano', 'Flour', 'Sugar',
              'Butter', 'Milk', 'Eggs', 'Rice', 'Pasta',
              'Chicken', 'Beef', 'Pork', 'Fish', 'Carrot',
              'Potato', 'Celery', 'Lemon', 'Lime', 'Ginger'
          ];

          // First add common ingredients
          for (const name of commonIngredients) {
              if (ingredients.length < count) {
                  uniqueNames.add(name);
                  ingredients.push({ name });
              }
          }

          // Then add random ingredients until we reach the desired count
          while (ingredients.length < count) {
              let name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`;
              if (!uniqueNames.has(name)) {
                  uniqueNames.add(name);
                  ingredients.push({ name });
              }
          }

          return ingredients;
      };

      const ingredients = seedIngredients(20);
      const insertedIngredients = await models.Ingredient.insertMany(ingredients);
      console.log('Ingredients seeded');

    // Seed User Prompts
    const userPrompts = Array.from({ length: 20 }).map(() => ({
      userId: faker.random.arrayElement(insertedUsers)._id,
      prompt: JSON.stringify({
        question: faker.lorem.sentence(),
        preferences: faker.lorem.words()
      }),
    }));
    const insertedUserPrompts = await models.UserPrompt.insertMany(userPrompts);
    console.log('User Prompts seeded');

    // Seed AI Responses
    const aiResponses = insertedUserPrompts.map((userPrompt) => ({
      userPromptId: userPrompt._id,
      response: JSON.stringify({
        answer: faker.lorem.paragraph(),
        suggestions: faker.lorem.sentences()
      }),
    }));
    const insertedAIResponses = await models.AIResponse.insertMany(aiResponses);
    console.log('AI Responses seeded');

    // Seed Recipes
    const recipes = Array.from({ length: 15 }).map(() => ({
      name: faker.commerce.productName(),
      prep: JSON.stringify({
        time: faker.random.arrayElement(['15 mins', '30 mins', '1 hour']),
        difficulty: faker.random.arrayElement(['easy', 'medium', 'hard'])
      }),
      cook: JSON.stringify({
        time: faker.random.arrayElement(['20 mins', '45 mins', '1.5 hours']),
        method: faker.random.arrayElement(['bake', 'fry', 'grill'])
      }),
      portionSize: faker.datatype.number({ min: 1, max: 10 }),
      finalComment: faker.lorem.sentence(),
      aiResponseId: faker.random.arrayElement(insertedAIResponses)._id,
    }));
    const insertedRecipes = await models.Recipe.insertMany(recipes);
    console.log('Recipes seeded');

    // Seed Instructions
    const instructions = insertedRecipes.flatMap((recipe) =>
        Array.from({ length: 5 }).map((_, idx) => ({
          recipeId: recipe._id,
          part: idx + 1,
          steps: JSON.stringify(
              Array(3).fill().map(() => faker.lorem.sentence())
          ),
        }))
    );
    await models.Instruction.insertMany(instructions);
    console.log('Instructions seeded');

      // Helper function to generate unique recipe ingredients
      const generateUniqueRecipeIngredients = (recipes, ingredients) => {
          const recipeIngredients = [];
          const usedCombinations = new Set();

          recipes.forEach(recipe => {
              // Get 5 random ingredients for each recipe
              const availableIngredients = [...ingredients];

              for (let i = 0; i < 5 && availableIngredients.length > 0; i++) {
                  // Get random index and remove the ingredient from available ingredients
                  const randomIndex = Math.floor(Math.random() * availableIngredients.length);
                  const ingredient = availableIngredients.splice(randomIndex, 1)[0];

                  const combinationKey = `${recipe._id}-${ingredient._id}`;
                  if (!usedCombinations.has(combinationKey)) {
                      usedCombinations.add(combinationKey);
                      recipeIngredients.push({
                          recipeId: recipe._id,
                          ingredientId: ingredient._id,
                          value: faker.datatype.number({ min: 1, max: 100 }),
                          unit: faker.random.arrayElement(['g', 'ml', 'tbsp', 'tsp']),
                          comment: faker.lorem.sentence(),
                      });
                  }
              }
          });

          return recipeIngredients;
      };

      const recipeIngredients = generateUniqueRecipeIngredients(insertedRecipes, insertedIngredients);
      await models.RecipeIngredient.insertMany(recipeIngredients);
      console.log('Recipe Ingredients seeded');

    // Seed Recipe Modifications
    const recipeModifications = insertedRecipes.flatMap((recipe) =>
        Array.from({ length: 3 }).map(() => ({
          recipeId: recipe._id,
          userPromptId: faker.random.arrayElement(insertedUserPrompts)._id,
          isActive: faker.datatype.boolean(),
        }))
    );
    const insertedRecipeModifications = await models.RecipeModification.insertMany(recipeModifications);
    console.log('Recipe Modifications seeded');

    // Seed Modification Responses
    const modificationResponses = insertedAIResponses.flatMap((aiResponse) =>
        Array.from({ length: 3 }).map(() => ({
          aiResponseId: aiResponse._id,
          modificationId: faker.random.arrayElement(insertedRecipeModifications)._id,
          appliedToRecipe: faker.datatype.boolean(),
        }))
    );
    await models.ModificationResponse.insertMany(modificationResponses);
    console.log('Modification Responses seeded');

      const generateUniqueUserRecipes = (recipes, users) => {
          const userRecipes = [];
          const usedCombinations = new Set();

          recipes.forEach(recipe => {
              // Get 3 random users for each recipe
              const availableUsers = [...users];

              for (let i = 0; i < 3 && availableUsers.length > 0; i++) {
                  // Get random index and remove the user from available users
                  const randomIndex = Math.floor(Math.random() * availableUsers.length);
                  const user = availableUsers.splice(randomIndex, 1)[0];

                  const combinationKey = `${user._id}-${recipe._id}`;
                  if (!usedCombinations.has(combinationKey)) {
                      usedCombinations.add(combinationKey);
                      userRecipes.push({
                          userId: user._id,
                          recipeId: recipe._id,
                          createdAt: new Date()
                      });
                  }
              }
          });

          return userRecipes;
      };

      const userRecipes = generateUniqueUserRecipes(insertedRecipes, insertedUsers);
      await models.UserRecipe.insertMany(userRecipes);
      console.log('User Recipes seeded');

    console.log('MongoDB seeding completed successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeder
seedMongoDB();