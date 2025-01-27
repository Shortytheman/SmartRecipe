import express from 'express';
import graphService from './neo4jservice.js';

const neo4jRouter = express.Router();

// User Routes
neo4jRouter.post('/users', async (req, res) => {
  try {
    const user = await graphService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await graphService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await graphService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.delete('/users/:id', async (req, res) => {
  try {
    await graphService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Prompt Routes
neo4jRouter.post('/userprompts', async (req, res) => {
  try {
    const userPrompt = await graphService.createUserPrompt(req.body);
    res.status(201).json(userPrompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Response Routes
neo4jRouter.post('/airesponses', async (req, res) => {
  try {
    const aiResponse = await graphService.createAIResponse(req.body);
    res.status(201).json(aiResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe Routes
neo4jRouter.post('/recipes', async (req, res) => {
  try {
    const recipe = await graphService.createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await graphService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe Ingredient Routes
neo4jRouter.post('/recipeIngredients', async (req, res) => {
  try {
    const recipeIngredient = await graphService.createRecipeIngredient(req.body);
    res.status(201).json(recipeIngredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/recipeIngredients/:recipeId', async (req, res) => {
  try {
    const ingredients = await graphService.getRecipeIngredientsByRecipeId(req.params.recipeId);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ingredient Routes
neo4jRouter.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await graphService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Instruction Routes
neo4jRouter.post('/instructions', async (req, res) => {
  try {
    const instruction = await graphService.createInstruction(req.body);
    res.status(201).json(instruction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe Modification Routes
neo4jRouter.post('/recipeModifications', async (req, res) => {
  try {
    const recipeModification = await graphService.createRecipeModification(req.body);
    res.status(201).json(recipeModification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modification Response Routes
neo4jRouter.post('/modificationResponses', async (req, res) => {
  try {
    const modificationResponse = await graphService.createModificationResponse(req.body);
    res.status(201).json(modificationResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Recipe Routes
neo4jRouter.post('/userRecipes', async (req, res) => {
  try {
    const userRecipe = await graphService.createUserRecipe(req.body);
    res.status(201).json(userRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default neo4jRouter;
