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
  prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt' }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for User
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
  aiResponse: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse' },
  modifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification' }]
}, {
  timestamps: true
});


const AIResponseSchema = new mongoose.Schema({
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', unique: true, required: true },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [validateJSON, 'Invalid JSON format for response']
  },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, {
  timestamps: true
});

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
  instructions: [{
    part: { type: Number, required: true },
    steps: {
      type: [String],
      required: true,
      validate: [arr => arr.length > 0, 'Steps cannot be empty']
    },
    _id: false
  }],
  ingredients: [{
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    comment: { type: String },
    _id: false
  }],
  users: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    savedAt: { type: Date, default: Date.now },
    _id: false
  }],
  modifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for Recipe
RecipeSchema.index({ name: 'text' });
RecipeSchema.index({ aiResponseId: 1 });
RecipeSchema.index({ 'ingredients.ingredientId': 1 });
RecipeSchema.index({ 'users.userId': 1 });

// Ingredient Schema
const IngredientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for Ingredient
IngredientSchema.index({ name: 'text' });

// RecipeModification Schema
const RecipeModificationSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', required: true },
  isActive: { type: Boolean, required: true, default: true },
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, {
  timestamps: true
});

// ModificationResponse Schema
const ModificationResponseSchema = new mongoose.Schema({
  aiResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
  modificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification', required: true },
  appliedToRecipe: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
});

// Create models
const models = {
  User: mongoose.model('User', UserSchema),
  UserPrompt: mongoose.model('UserPrompt', UserPromptSchema),
  AIResponse: mongoose.model('AIResponse', AIResponseSchema),
  Recipe: mongoose.model('Recipe', RecipeSchema),
  Ingredient: mongoose.model('Ingredient', IngredientSchema),
  RecipeModification: mongoose.model('RecipeModification', RecipeModificationSchema),
  ModificationResponse: mongoose.model('ModificationResponse', ModificationResponseSchema)
};

export default models;