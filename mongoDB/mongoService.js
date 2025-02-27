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

  async getAll(model) {
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const Model = models[modelName];
    console.log("Model, ", Model)

    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }

    return service.mongo.read(Model, {});
  },

  async createModel(model, data) {
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const Model = models[modelName];
    console.log("Model, ", Model)
    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return service.mongo.create(Model, data);
  },

  async getModel(model, id){
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const Model = models[modelName];
    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return service.mongo.readById(Model, id);
  },

  async updateModel(model, id, data){
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const Model = models[modelName];
    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return service.mongo.updateById(Model, id, data)
  },

  async deleteModel(model, id){
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const Model = models[modelName];
    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return service.mongo.deleteById(Model, id)
  }
  // // User operations
  // getUsers: () => service.mongo.read(User, {}),
  // createUser: (data) => service.mongo.create(User, data),
  // getUser: (id) => service.mongo.readById(User, id),
  // updateUser: (id, data) => service.mongo.updateById(User, id, data),
  // deleteUser: (id) => service.mongo.deleteById(User, id),
  //
  // // UserPrompt operations
  // getUserPrompts: () => service.mongo.read(UserPrompt, {}),
  // createUserPrompt: (data) => service.mongo.create(UserPrompt, data),
  // getUserPrompt: (id) => service.mongo.readById(UserPrompt, id),
  // updateUserPrompt: (id, data) => service.mongo.updateById(UserPrompt, id, data),
  // deleteUserPrompt: (id) => service.mongo.deleteById(UserPrompt, id),
  //
  // // AIResponse operations
  // getAIResponses: () => service.mongo.read(AIResponse, {}),
  // createAIResponse: (data) => service.mongo.create(AIResponse, data),
  // getAIResponse: (id) => service.mongo.readById(AIResponse, id),
  // updateAIResponse: (id, data) => service.mongo.updateById(AIResponse, id, data),
  // deleteAIResponse: (id) => service.mongo.deleteById(AIResponse, id),
  //
  // // Recipe operations
  // getRecipes: () => service.mongo.read(Recipe, {}),
  // createRecipe: (data) => service.mongo.create(Recipe, data),
  // getRecipe: (id) => service.mongo.readById(Recipe, id),
  // updateRecipe: (id, data) => service.mongo.updateById(Recipe, id, data),
  // deleteRecipe: (id) => service.mongo.deleteById(Recipe, id),
  //
  // // Ingredient operations
  // getIngredients: () => service.mongo.read(Ingredient, {}),
  // createIngredient: (data) => service.mongo.create(Ingredient, data),
  // getIngredient: (id) => service.mongo.readById(Ingredient, id),
  // updateIngredient: (id, data) => service.mongo.updateById(Ingredient, id, data),
  // deleteIngredient: (id) => service.mongo.deleteById(Ingredient, id),
  //
  // // RecipeModification operations
  // getRecipeModifications: () => service.mongo.read(RecipeModification, {}),
  // createRecipeModification: (data) => service.mongo.create(RecipeModification, data),
  // getRecipeModification: (id) => service.mongo.readById(RecipeModification, id),
  // updateRecipeModification: (id, data) => service.mongo.updateById(RecipeModification, id, data),
  // deleteRecipeModification: (id) => service.mongo.deleteById(RecipeModification, id),
  //
  // // ModificationResponse operations
  // getModificationResponses: () => service.mongo.read(ModificationResponse, {}),
  // createModificationResponse: (data) => service.mongo.create(ModificationResponse, data),
  // getModificationResponse: (id) => service.mongo.readById(ModificationResponse, id),
  // updateModificationResponse: (id, data) => service.mongo.updateById(ModificationResponse, id, data),
  // deleteModificationResponse: (id) => service.mongo.deleteById(ModificationResponse, id)
};

export const closeConnections = async () => {
  await mongoose.disconnect();
};