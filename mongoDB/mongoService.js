import {mongoose} from "./mongoConnector.js";
import models from "./mongoSchema.js"; // Import the default export

const {
  User, UserPrompt, AIResponse, Recipe, RecipeIngredient, Ingredient, Instruction,
  RecipeModification, ModificationResponse, UserRecipe,
} = models;

const service = {
  mongo: {
    create: (Model, data) => Model.create(data),
    read: (Model, query) => Model.find(query),
    readById: (Model, id) => Model.findById(id), // Add method to read by ID
    updateById: (Model, id, data) => Model.findByIdAndUpdate(id, data, { new: true }), // Add method to update by ID
    deleteById: (Model, id) => Model.findByIdAndDelete(id) // Add method to delete by ID
  }
};

export const MongoService = {
  createUser: (data) => service.mongo.create(User, data),
  getUser: (id) => service.mongo.readById(User, id),
  updateUser: (id, data) => service.mongo.updateById(User, id, data),
  deleteUser: (id) => service.mongo.deleteById(User, id),

  createUserPrompt: (data) => service.mongo.create(UserPrompt, data),
  getUserPrompt: (id) => service.mongo.readById(UserPrompt, id),
  updateUserPrompt: (id, data) => service.mongo.updateById(UserPrompt, id, data),
  deleteUserPrompt: (id) => service.mongo.deleteById(UserPrompt, id),

  createAIResponse: (data) => service.mongo.create(AIResponse, data),
  getAIResponse: (id) => service.mongo.readById(AIResponse, id),
  updateAIResponse: (id, data) => service.mongo.updateById(AIResponse, id, data),
  deleteAIResponse: (id) => service.mongo.deleteById(AIResponse, id),

  createRecipe: (data) => service.mongo.create(Recipe, data),
  getRecipe: (id) => service.mongo.readById(Recipe, id),
  updateRecipe: (id, data) => service.mongo.updateById(Recipe, id, data),
  deleteRecipe: (id) => service.mongo.deleteById(Recipe, id),

  createRecipeIngredient: (data) => service.mongo.create(RecipeIngredient, data),
  getRecipeIngredient: (id) => service.mongo.readById(RecipeIngredient, id),
  updateRecipeIngredient: (id, data) => service.mongo.updateById(RecipeIngredient, id, data),
  deleteRecipeIngredient: (id) => service.mongo.deleteById(RecipeIngredient, id),

  createIngredient: (data) => service.mongo.create(Ingredient, data),
  getIngredient: (id) => service.mongo.readById(Ingredient, id),
  updateIngredient: (id, data) => service.mongo.updateById(Ingredient, id, data),
  deleteIngredient: (id) => service.mongo.deleteById(Ingredient, id),

  createInstruction: (data) => service.mongo.create(Instruction, data),
  getInstruction: (id) => service.mongo.readById(Instruction, id),
  updateInstruction: (id, data) => service.mongo.updateById(Instruction, id, data),
  deleteInstruction: (id) => service.mongo.deleteById(Instruction, id),

  createRecipeModification: (data) => service.mongo.create(RecipeModification, data),
  getRecipeModification: (id) => service.mongo.readById(RecipeModification, id),
  updateRecipeModification: (id, data) => service.mongo.updateById(RecipeModification, id, data),
  deleteRecipeModification: (id) => service.mongo.deleteById(RecipeModification, id),

  createModificationResponse: (data) => service.mongo.create(ModificationResponse, data),
  getModificationResponse: (id) => service.mongo.readById(ModificationResponse, id),
  updateModificationResponse: (id, data) => service.mongo.updateById(ModificationResponse, id, data),
  deleteModificationResponse: (id) => service.mongo.deleteById(ModificationResponse, id),

  createUserRecipe: (data) => service.mongo.create(UserRecipe, data),
  getUserRecipe: (id) => service.mongo.readById(UserRecipe, id),
  updateUserRecipe: (id, data) => service.mongo.updateById(UserRecipe, id, data),
  deleteUserRecipe: (id) => service.mongo.deleteById(UserRecipe, id),
};

export const closeConnections = async () => {
  await mongoose.disconnect();
};