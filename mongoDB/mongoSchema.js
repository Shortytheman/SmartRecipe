// mongoSchema.js
import mongoose from 'mongoose';

// Validation functions
const validateJSON = (value) => {
  if (!value) return false;
  try {
    if (typeof value === 'string') JSON.parse(value);
    return true;
  } catch(e) {
    return false;
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  oauthId: { type: String },
  oauthProvider: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt' }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  userRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRecipe' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for User
UserSchema.index({ email: 1 });
UserSchema.index({ oauthId: 1, oauthProvider: 1 });
UserSchema.index({ name: 'text' });

// UserPrompt Schema
const UserPromptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for prompt']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  aiResponse: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse' },
  modifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification' }]
}, { timestamps: true });

// AIResponse Schema
const AIResponseSchema = new mongoose.Schema({
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', unique: true, required: true },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for response']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, { timestamps: true });

// Recipe Schema
const RecipeSchema = new mongoose.Schema({
  aiResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
  name: { type: String, required: true },
  prep: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for prep']
  },
  cook: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for cook']
  },
  portionSize: { type: Number, required: true, min: 1 },
  finalComment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  instructions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instruction' }],
  recipeIngredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeIngredient' }],
  modifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
  recipeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRecipe' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for Recipe
RecipeSchema.index({ name: 'text' });
RecipeSchema.index({ aiResponseId: 1 });
RecipeSchema.index({ 'recipeIngredients.ingredientId': 1 });

// RecipeIngredient Schema
const RecipeIngredientSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  value: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: true });

// Compound index for RecipeIngredient
RecipeIngredientSchema.index({ recipeId: 1, ingredientId: 1 }, { unique: true });

// Ingredient Schema
const IngredientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  recipeIngredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeIngredient' }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for Ingredient
IngredientSchema.index({ name: 'text' });

// Instruction Schema
const InstructionSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  part: { type: Number, required: true, min: 1 },
  steps: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for steps']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: true });

// Index for Instructions
InstructionSchema.index({ recipeId: 1, part: 1 }, { unique: true });

// RecipeModification Schema
const RecipeModificationSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, { timestamps: true });

// ModificationResponse Schema
const ModificationResponseSchema = new mongoose.Schema({
  aiResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
  modificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification', required: true },
  appliedToRecipe: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: true });

// UserRecipe Schema
const UserRecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

// Compound index for UserRecipe
UserRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// Create models
const models = {
  User: mongoose.model('User', UserSchema),
  UserPrompt: mongoose.model('UserPrompt', UserPromptSchema),
  AIResponse: mongoose.model('AIResponse', AIResponseSchema),
  Recipe: mongoose.model('Recipe', RecipeSchema),
  RecipeIngredient: mongoose.model('RecipeIngredient', RecipeIngredientSchema),
  Ingredient: mongoose.model('Ingredient', IngredientSchema),
  Instruction: mongoose.model('Instruction', InstructionSchema),
  RecipeModification: mongoose.model('RecipeModification', RecipeModificationSchema),
  ModificationResponse: mongoose.model('ModificationResponse', ModificationResponseSchema),
  UserRecipe: mongoose.model('UserRecipe', UserRecipeSchema)
};

export default models;