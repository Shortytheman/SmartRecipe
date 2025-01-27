import mongoose from 'mongoose';
import faker from 'faker';
import {
  User, UserPrompt, AIResponse, Recipe, RecipeIngredient, Ingredient, Instruction,
  RecipeModification, ModificationResponse, UserRecipe
} from './mongoSchema.js';

const seedMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    const collections = [User, UserPrompt, AIResponse, Recipe, RecipeIngredient, Ingredient, Instruction, RecipeModification, ModificationResponse, UserRecipe];
    for (const collection of collections) {
      await collection.deleteMany({});
    }
    console.log('Existing data cleared');

    // Seed Users
    const users = Array.from({ length: 10 }).map(() => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      oauthId: faker.datatype.uuid(),
      oauthProvider: faker.random.arrayElement(['google', 'facebook', 'github']),
    }));
    const insertedUsers = await User.insertMany(users);

    // Seed Ingredients
    const ingredients = Array.from({ length: 20 }).map(() => ({
      name: faker.commerce.productName(),
    }));
    const insertedIngredients = await Ingredient.insertMany(ingredients);

    // Seed Recipes
    const recipes = Array.from({ length: 15 }).map(() => ({
      name: faker.commerce.productName(),
      prep: faker.lorem.paragraph(),
      cook: faker.lorem.paragraph(),
      portionSize: faker.datatype.number({ min: 1, max: 10 }),
      finalComment: faker.lorem.sentence(),
      aiResponseId: null, // Will be set later
    }));
    const insertedRecipes = await Recipe.insertMany(recipes);

    // Seed Instructions
    const instructions = insertedRecipes.flatMap((recipe) =>
      Array.from({ length: 5 }).map((_, idx) => ({
        recipeId: recipe._id,
        part: idx + 1,
        steps: faker.lorem.paragraphs(2),
      }))
    );
    await Instruction.insertMany(instructions);

    // Seed Recipe Ingredients
    const recipeIngredients = insertedRecipes.flatMap((recipe) =>
      Array.from({ length: 5 }).map(() => ({
        recipeId: recipe._id,
        ingredientId: faker.random.arrayElement(insertedIngredients)._id,
        value: faker.datatype.number({ min: 1, max: 100 }),
        unit: faker.random.arrayElement(['g', 'ml', 'tbsp', 'tsp']),
        comment: faker.lorem.sentence(),
      }))
    );
    await RecipeIngredient.insertMany(recipeIngredients);

    // Seed User Prompts and AI Responses
    const userPrompts = Array.from({ length: 20 }).map(() => ({
      userId: faker.random.arrayElement(insertedUsers)._id,
      prompt: faker.lorem.sentence(),
    }));
    const insertedUserPrompts = await UserPrompt.insertMany(userPrompts);

    const aiResponses = insertedUserPrompts.map((userPrompt) => ({
      userPromptId: userPrompt._id,
      response: faker.lorem.paragraphs(2),
    }));
    const insertedAIResponses = await AIResponse.insertMany(aiResponses);

    // Assign AIResponse IDs to Recipes
    for (let i = 0; i < insertedRecipes.length; i++) {
      insertedRecipes[i].aiResponseId = insertedAIResponses[i % insertedAIResponses.length]._id;
      await insertedRecipes[i].save();
    }

    // Seed Recipe Modifications
    const recipeModifications = insertedRecipes.flatMap((recipe) =>
      Array.from({ length: 3 }).map(() => ({
        recipeId: recipe._id,
        userPromptId: faker.random.arrayElement(insertedUserPrompts)._id,
        isActive: faker.datatype.boolean(),
      }))
    );
    const insertedRecipeModifications = await RecipeModification.insertMany(recipeModifications);

    // Seed Modification Responses
    const modificationResponses = insertedAIResponses.flatMap((aiResponse) =>
      Array.from({ length: 3 }).map(() => ({
        aiResponseId: aiResponse._id,
        modificationId: faker.random.arrayElement(insertedRecipeModifications)._id,
        appliedToRecipe: faker.datatype.boolean(),
      }))
    );
    await ModificationResponse.insertMany(modificationResponses);

    // Seed User Recipes
    const userRecipes = insertedRecipes.flatMap((recipe) =>
      Array.from({ length: 3 }).map(() => ({
        userId: faker.random.arrayElement(insertedUsers)._id,
        recipeId: recipe._id,
      }))
    );
    await UserRecipe.insertMany(userRecipes);

    console.log('MongoDB seeding completed successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedMongoDB();
