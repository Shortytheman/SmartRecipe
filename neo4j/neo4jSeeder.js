import { neo4jservice } from "./neo4jservice.js";

const { createRelationship } = neo4jservice.nodes;

// Helper function to create nodes and relationships within transactions
const createNode = async (label, data) => {
  const result = await neo4jservice.nodes.create(label, data);
  return result; 
};

// Seeder function
const seedData = async () => {
  // Create Ingredients
  const ingredients = await Promise.all([
    createNode("Ingredient", { name: "Tomato" }),
    createNode("Ingredient", { name: "Cheese" }),
    createNode("Ingredient", { name: "Basil" }),
  ]);

  // Create Users
  const users = await Promise.all([
    createNode("User", { name: "John Doe", email: "john@example.com" }),
    createNode("User", { name: "Jane Smith", email: "jane@example.com" }),
  ]);

  // Create Recipes
  const recipes = await Promise.all([
    createNode("Recipe", { name: "Tomato Pasta", portionSize: 4, finalComment: "Delicious!" }),
    createNode("Recipe", { name: "Cheese Pizza", portionSize: 2, finalComment: "A classic!" }),
  ]);

  // Create Instructions for Recipes
  const instructions = await Promise.all([
    createNode("Instruction", { part: 1, steps: JSON.stringify(["Boil water", "Cook pasta"]) }),
    createNode("Instruction", { part: 1, steps: JSON.stringify(["Preheat oven", "Bake pizza"]) }),
  ]);

  // Create User Prompts
  const userPrompts = await Promise.all([
    createNode("UserPrompt", { userId: users[0].id, prompt: JSON.stringify({ question: "How to cook pasta?" }) }),
    createNode("UserPrompt", { userId: users[1].id, prompt: JSON.stringify({ question: "How to bake pizza?" }) }),
  ]);

  // Create AI Responses
  const aiResponses = await Promise.all([
    createNode("AIResponse", { userPromptId: userPrompts[0].id, response: JSON.stringify({ answer: "Boil water and cook pasta" }) }),
    createNode("AIResponse", { userPromptId: userPrompts[1].id, response: JSON.stringify({ answer: "Preheat oven and bake pizza" }) }),
  ]);

  // Create Recipe Modifications
  const recipeModifications = await Promise.all([
    createNode("RecipeModification", { recipeId: recipes[0].id, userPromptId: userPrompts[0].id, isActive: true }),
    createNode("RecipeModification", { recipeId: recipes[1].id, userPromptId: userPrompts[1].id, isActive: true }),
  ]);

  // Create Modification Responses
  const modificationResponses = await Promise.all([
    createNode("ModificationResponse", { aiResponseId: aiResponses[0].id, modificationId: recipeModifications[0].id, appliedToRecipe: true }),
    createNode("ModificationResponse", { aiResponseId: aiResponses[1].id, modificationId: recipeModifications[1].id, appliedToRecipe: true }),
  ]);

// Creating relationships
await createRelationship(users[0], "WRITES_PROMPT", userPrompts[0]);
await createRelationship(users[1], "WRITES_PROMPT", userPrompts[1]);

await createRelationship(userPrompts[0], "HAS_RESPONSE", aiResponses[0]);
await createRelationship(userPrompts[1], "HAS_RESPONSE", aiResponses[1]);

await createRelationship(aiResponses[0], "GENERATES_RECIPE", recipes[0]);
await createRelationship(aiResponses[1], "GENERATES_RECIPE", recipes[1]);

await createRelationship(users[0], "OWNS_RECIPE", recipes[0]);
await createRelationship(users[1], "OWNS_RECIPE", recipes[1]);

await createRelationship(recipes[0], "CONTAINS_INGREDIENT", ingredients[0]);
await createRelationship(recipes[0], "CONTAINS_INGREDIENT", ingredients[1]);
await createRelationship(recipes[1], "CONTAINS_INGREDIENT", ingredients[1]);
await createRelationship(recipes[1], "CONTAINS_INGREDIENT", ingredients[2]);

await createRelationship(recipes[0], "HAS_INSTRUCTION", instructions[0]);
await createRelationship(recipes[1], "HAS_INSTRUCTION", instructions[1]);

await createRelationship(recipes[0], "HAS_MODIFICATION", recipeModifications[0]);
await createRelationship(recipes[1], "HAS_MODIFICATION", recipeModifications[1]);

await createRelationship(recipeModifications[0], "HAS_MODIFICATION_RESPONSE", modificationResponses[0]);
await createRelationship(recipeModifications[1], "HAS_MODIFICATION_RESPONSE", modificationResponses[1]);


};

seedData()
  .then(() => console.log("Seeder ran successfully"))
  .catch(err => console.error("Seeder failed:", err));
