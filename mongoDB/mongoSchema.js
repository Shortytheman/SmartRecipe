import mongoose from 'mongoose';

// User Schema
export const UserSchema = new mongoose.Schema({
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
}, { timestamps: { createdAt: true, updatedAt: true } });

// UserPrompt Schema
export const UserPromptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  aiResponse: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse' },
  modifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification' }]
}, { timestamps: { createdAt: true, updatedAt: true } });

// AIResponse Schema
export const AIResponseSchema = new mongoose.Schema({
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', unique: true, required: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, { timestamps: { createdAt: true, updatedAt: true } });

// Recipe Schema
export const RecipeSchema = new mongoose.Schema({
  aiResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
  name: { type: String, required: true },
  prep: { type: mongoose.Schema.Types.Mixed, required: true },
  cook: { type: mongoose.Schema.Types.Mixed, required: true },
  portionSize: { type: Number, required: true },
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
}, { timestamps: { createdAt: true, updatedAt: true } });

// RecipeIngredient Schema
export const RecipeIngredientSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: true } });

// Ingredient Schema
export const IngredientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  recipeIngredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeIngredient' }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: { createdAt: true, updatedAt: true } });

// Instruction Schema
export const InstructionSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  part: { type: Number, required: true },
  steps: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: true } });

// RecipeModification Schema
export const RecipeModificationSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userPromptId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', required: true },
  isActive: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  modificationResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModificationResponse' }]
}, { timestamps: { createdAt: true, updatedAt: true } });

// ModificationResponse Schema
export const ModificationResponseSchema = new mongoose.Schema({
  aiResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
  modificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModification', required: true },
  appliedToRecipe: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: true } });

// UserRecipe Schema
export const UserRecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Exporting Models
export default {
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
