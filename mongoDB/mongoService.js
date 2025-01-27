import mongoose from "mongoose";
import {
  User, UserPrompt, AIResponse, Recipe, RecipeIngredient, Ingredient, Instruction,
  RecipeModification, ModificationResponse, UserRecipe,
} from "./mongoSchema.js";


const service = {
  mongo: {
    create: (Model, data) => Model.create(data),
    read: (Model, query) => Model.find(query),
    update: (Model, query, data) => Model.updateMany(query, data),
    delete: (Model, query) => Model.deleteMany(query),
  }
};


export const mongoService = {
  users: {
    create: (data) => service.mongo.create(User, data),
    read: (query) => service.mongo.read(User, query),
    update: (query, data) => service.mongo.update(User, query, data),
    delete: (query) => service.mongo.delete(User, query),
  },
  userPrompts: {
    create: (data) => service.mongo.create(UserPrompt, data),
    read: (query) => service.mongo.read(UserPrompt, query),
    update: (query, data) => service.mongo.update(UserPrompt, query, data),
    delete: (query) => service.mongo.delete(UserPrompt, query),
  },
  aiResponses: {
    create: (data) => service.mongo.create(AIResponse, data),
    read: (query) => service.mongo.read(AIResponse, query),
    update: (query, data) => service.mongo.update(AIResponse, query, data),
    delete: (query) => service.mongo.delete(AIResponse, query),
  },
  recipes: {
    create: (data) => service.mongo.create(Recipe, data),
    read: (query) => service.mongo.read(Recipe, query),
    update: (query, data) => service.mongo.update(Recipe, query, data),
    delete: (query) => service.mongo.delete(Recipe, query),
  },
  recipeIngredients: {
    create: (data) => service.mongo.create(RecipeIngredient, data),
    read: (query) => service.mongo.read(RecipeIngredient, query),
    update: (query, data) => service.mongo.update(RecipeIngredient, query, data),
    delete: (query) => service.mongo.delete(RecipeIngredient, query),
  },
  ingredients: {
    create: (data) => service.mongo.create(Ingredient, data),
    read: (query) => service.mongo.read(Ingredient, query),
    update: (query, data) => service.mongo.update(Ingredient, query),
    delete: (query) => service.mongo.delete(Ingredient, query),
  },
  instructions: {
    create: (data) => service.mongo.create(Instruction, data),
    read: (query) => service.mongo.read(Instruction, query),
    update: (query, data) => service.mongo.update(Instruction, query),
    delete: (query) => service.mongo.delete(Instruction, query),
  },
  recipeModifications: {
    create: (data) => service.mongo.create(RecipeModification, data),
    read: (query) => service.mongo.read(RecipeModification, query),
    update: (query, data) => service.mongo.update(RecipeModification, query, data),
    delete: (query) => service.mongo.delete(RecipeModification, query),
  },
  modificationResponses: {
    create: (data) => service.mongo.create(ModificationResponse, data),
    read: (query) => service.mongo.read(ModificationResponse, query),
    update: (query, data) => service.mongo.update(ModificationResponse, query, data),
    delete: (query) => service.mongo.delete(ModificationResponse, query),
  },
  userRecipes: {
    create: (data) => service.mongo.create(UserRecipe, data),
    read: (query) => service.mongo.read(UserRecipe, query),
    update: (query, data) => service.mongo.update(UserRecipe, query, data),
    delete: (query) => service.mongo.delete(UserRecipe, query),
  },
};

export const closeConnections = async () => {
  await mongoose.disconnect();
};