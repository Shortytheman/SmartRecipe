import { mongoose } from "./mongoConnector.js";
import models from "./mongoSchema.js";

const {
  User,
  UserPrompt,
  AIResponse,
  Recipe,
  Ingredient,
  RecipeModification,
  ModificationResponse
} = models;

const service = {
  mongo: {
    create: (Model, data) => Model.create(data),
    read: (Model, query) => Model.find(query),
    readById: (Model, id) => Model.findById(id),
    updateById: (Model, id, data) => Model.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (Model, id) => Model.findByIdAndDelete(id)
  }
};

export const MongoService = {
  // User operations
  createUser: (data) => service.mongo.create(User, data),
  getUser: (id) => service.mongo.readById(User, id),
  updateUser: (id, data) => service.mongo.updateById(User, id, data),
  deleteUser: (id) => service.mongo.deleteById(User, id),

  // UserPrompt operations
  createUserPrompt: (data) => service.mongo.create(UserPrompt, data),
  getUserPrompt: (id) => service.mongo.readById(UserPrompt, id),
  updateUserPrompt: (id, data) => service.mongo.updateById(UserPrompt, id, data),
  deleteUserPrompt: (id) => service.mongo.deleteById(UserPrompt, id),

  // AIResponse operations
  createAIResponse: (data) => service.mongo.create(AIResponse, data),
  getAIResponse: (id) => service.mongo.readById(AIResponse, id),
  getAll: (data) => service.mongo.read(AIResponse, data),
  updateAIResponse: (id, data) => service.mongo.updateById(AIResponse, id, data),
  deleteAIResponse: (id) => service.mongo.deleteById(AIResponse, id),

  // Recipe operations
  createRecipe: (data) => service.mongo.create(Recipe, data),
  getRecipe: (id) => service.mongo.readById(Recipe, id),
  updateRecipe: (id, data) => service.mongo.updateById(Recipe, id, data),
  deleteRecipe: (id) => service.mongo.deleteById(Recipe, id),

  // Ingredient operations
  createIngredient: (data) => service.mongo.create(Ingredient, data),
  getIngredient: (id) => service.mongo.readById(Ingredient, id),
  updateIngredient: (id, data) => service.mongo.updateById(Ingredient, id, data),
  deleteIngredient: (id) => service.mongo.deleteById(Ingredient, id),

  // RecipeModification operations
  createRecipeModification: (data) => service.mongo.create(RecipeModification, data),
  getRecipeModification: (id) => service.mongo.readById(RecipeModification, id),
  updateRecipeModification: (id, data) => service.mongo.updateById(RecipeModification, id, data),
  deleteRecipeModification: (id) => service.mongo.deleteById(RecipeModification, id),

  // ModificationResponse operations
  createModificationResponse: (data) => service.mongo.create(ModificationResponse, data),
  getModificationResponse: (id) => service.mongo.readById(ModificationResponse, id),
  updateModificationResponse: (id, data) => service.mongo.updateById(ModificationResponse, id, data),
  deleteModificationResponse: (id) => service.mongo.deleteById(ModificationResponse, id)
};

export const closeConnections = async () => {
  await mongoose.disconnect();
};