import { prisma } from '../mysqlConnector.js';

class MySQLService {
  constructor() {
    this.prisma = prisma;
  }

  async getAll(model) {
    const modelName = model.charAt(0).toUpperCase() + model.slice(1); // Capitalize model name
    const methodName = `get${modelName}s`; // Construct the pluralized method name

    if (typeof this[methodName] !== 'function') {
      throw new Error(`Method ${methodName} not found for model ${model}`);
    }

    return this[methodName](); // Call the dynamically constructed method
  }

  async createMethod(model, data) {
    const modelName = model.charAt(0).toUpperCase() + model.slice(1); // Capitalize model name
    const methodName = `create${modelName}`; // Construct the pluralized method name


    console.log(modelName)
    console.log(methodName)

    if (typeof this[methodName] !== 'function') {
      throw new Error(`Method ${methodName} not found for model ${model}`);
    }
    console.log(data)
    return this[methodName](data); // Call the dynamically constructed method
  }

  // CRUD Operations for Users
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async createUser(data) {
    return await this.prisma.user.create({
      data,
    });
  }

  async getUser(id) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id, data) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  // CRUD Operations for Ingredients

  async getIngredients() {
    return await this.prisma.ingredient.findMany();
  }
  async createIngredient(data) {
    return await this.prisma.ingredient.create({
      data,
    });
  }

  async getIngredient(id) {
    return await this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async updateIngredient(id, data) {
    return await this.prisma.ingredient.update({
      where: { id },
      data,
    });
  }

  async deleteIngredient(id) {
    return await this.prisma.ingredient.delete({
      where: { id },
    });
  }

  // CRUD Operations for UserPrompts

  async getUserPrompts() {
    return await this.prisma.userPrompt.findMany();
  }
  async createUserPrompt(data) {
    return await this.prisma.userPrompt.create({
      data,
    });
  }

  async getUserPrompt(id) {
    return await this.prisma.userPrompt.findUnique({
      where: { id },
    });
  }

  async updateUserPrompt(id, data) {
    return await this.prisma.userPrompt.update({
      where: { id },
      data,
    });
  }

  async deleteUserPrompt(id) {
    return await this.prisma.userPrompt.delete({
      where: { id },
    });
  }

  // CRUD Operations for AIResponses
  async getAIResponses() {
    return await this.prisma.aIResponse.findMany();
  }

  async createAIResponse(data) {
    return await this.prisma.aIResponse.create({
      data,
    });
  }

  async getAIResponse(id) {
    return await this.prisma.aIResponse.findUnique({
      where: { id },
    });
  }

  async updateAIResponse(id, data) {
    return await this.prisma.aIResponse.update({
      where: { id },
      data,
    });
  }

  async deleteAIResponse(id) {
    return await this.prisma.aIResponse.delete({
      where: { id },
    });
  }

  // CRUD Operations for Recipes

  async getRecipes() {
    return await this.prisma.recipe.findMany();
  }
  async createRecipe(data) {
    return await this.prisma.recipe.create({
      data,
    });
  }

  async getRecipe(id) {
    return await this.prisma.recipe.findUnique({
      where: { id },
    });
  }

  async updateRecipe(id, data) {
    return await this.prisma.recipe.update({
      where: { id },
      data,
    });
  }

  async deleteRecipe(id) {
    return await this.prisma.recipe.delete({
      where: { id },
    });
  }

  // CRUD Operations for Instructions

  async getInstructions() {
    return await this.prisma.instruction.findMany();
  }
  async createInstruction(data) {
    return await this.prisma.instruction.create({
      data,
    });
  }

  async getInstruction(id) {
    return await this.prisma.instruction.findUnique({
      where: { id },
    });
  }

  async updateInstruction(id, data) {
    return await this.prisma.instruction.update({
      where: { id },
      data,
    });
  }

  async deleteInstruction(id) {
    return await this.prisma.instruction.delete({
      where: { id },
    });
  }

  // CRUD Operations for RecipeIngredients

  async getRecipeIngredients() {
    return await this.prisma.recipeIngredient.findMany();
  }
  async createRecipeIngredient(data) {
    return await this.prisma.recipeIngredient.create({
      data,
    });
  }

  async getRecipeIngredient(id) {
    return await this.prisma.recipeIngredient.findUnique({
      where: { id },
    });
  }

  async updateRecipeIngredient(id, data) {
    return await this.prisma.recipeIngredient.update({
      where: { id },
      data,
    });
  }

  async deleteRecipeIngredient(id) {
    return await this.prisma.recipeIngredient.delete({
      where: { id },
    });
  }

  // CRUD Operations for RecipeModifications
  async getRecipeModifications() {
    return await this.prisma.recipeModification.findMany();
  }

  async createRecipeModification(data) {
    return await this.prisma.recipeModification.create({
      data,
    });
  }

  async getRecipeModification(id) {
    return await this.prisma.recipeModification.findUnique({
      where: { id },
    });
  }

  async updateRecipeModification(id, data) {
    return await this.prisma.recipeModification.update({
      where: { id },
      data,
    });
  }

  async deleteRecipeModification(id) {
    return await this.prisma.recipeModification.delete({
      where: { id },
    });
  }

  // CRUD Operations for ModificationResponses
  async getModificationResponses() {
    return await this.prisma.modificationResponse.findMany();
  }

  async createModificationResponse(data) {
    return await this.prisma.modificationResponse.create({
      data,
    });
  }

  async getModificationResponse(id) {
    return await this.prisma.modificationResponse.findUnique({
      where: { id },
    });
  }

  async updateModificationResponse(id, data) {
    return await this.prisma.modificationResponse.update({
      where: { id },
      data,
    });
  }

  async deleteModificationResponse(id) {
    return await this.prisma.modificationResponse.delete({
      where: { id },
    });
  }

  // CRUD Operations for UserRecipes
  async getUserRecipes() {
    return await this.prisma.userRecipe.findMany();
  }

  async createUserRecipe(data) {
    return await this.prisma.userRecipe.create({
      data,
    });
  }

  async getUserRecipe(id) {
    return await this.prisma.userRecipe.findUnique({
      where: { id },
    });
  }

  async updateUserRecipe(id, data) {
    return await this.prisma.userRecipe.update({
      where: { id },
      data,
    });
  }

  async deleteUserRecipe(id) {
    return await this.prisma.userRecipe.delete({
      where: { id },
    });
  }
}

export { MySQLService };