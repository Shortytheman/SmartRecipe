import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Recipe API',
      version: '1.0.0',
      description: 'API documentation for Smart Recipe application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Production server',
      }
    ],
    components: {
      parameters: {
        dbType: {
          in: 'path',
          name: 'dbType',
          required: true,
          schema: {
            type: 'string',
            enum: ['mysql', 'mongodb', 'neo4j']
          },
          description: 'Database type to query'
        },
        model: {
          in: 'path',
          name: 'model',
          required: true,
          schema: {
            type: 'string',
            enum: [
              'recipe',
              'user',
              'ingredient',
              'instruction',
              'userRecipe',
              'recipeIngredient',
              'userPrompt',
              'aiResponse'
            ]
          },
          description: 'Model to query'
        },
        modelId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            oneOf: [
              {
                type: 'integer',
                example: 1,
                description: 'Numeric ID for MySQL database'
              },
              {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                example: '507f1f77bcf86cd799439011',
                description: 'MongoDB ObjectId'
              }
            ]
          },
          description: 'ID of the model (number for MySQL, ObjectId for MongoDB)'
        }
      },
      schemas: {
        Recipe: {
            type: 'object',
            required: ['name', 'prep', 'cook', 'aiResponseId'],
            properties: {
              aiResponseId: {  
                type: 'integer',
                example: 1,
                description: 'ID of the associated AI response'
              },
              name: { 
                type: 'string',
                example: 'Spaghetti Carbonara'
              },
              prep: { 
                type: 'object',
                properties: {
                  time: { type: 'string', example: '15 minutes' },
                  steps: { 
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Dice bacon', 'Beat eggs']
                  }
                }
              },
              cook: {
                type: 'object',
                properties: {
                  time: { type: 'string', example: '20 minutes' },
                  temperature: { type: 'string', example: 'medium-high' }
                }
              },
              portionSize: { type: 'integer', example: 4 },
              finalComment: { type: 'string', example: 'Serve immediately' }
            }
          },
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { 
              type: 'string',
              example: 'John Doe'
            },
            email: { 
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            preferences: {
              type: 'object',
              properties: {
                dietary: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['vegetarian', 'gluten-free']
                }
              }
            }
          }
        },
        Ingredient: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { 
              type: 'string',
              example: 'Spaghetti'
            },
            category: {
              type: 'string',
              example: 'pasta'
            },
            nutritionalInfo: {
              type: 'object',
              properties: {
                calories: { type: 'number', example: 158 },
                protein: { type: 'number', example: 6 }
              }
            }
          }
        },
        Instruction: {
          type: 'object',
          required: ['recipeId', 'steps'],
          properties: {
            recipeId: { type: 'integer', example: 1 },
            part: { type: 'integer', example: 1 },
            steps: { 
              type: 'object',
              example: {
                "1": "Boil water",
                "2": "Add pasta",
                "3": "Cook until al dente"
              }
            }
          }
        },
        RecipeIngredient: {
          type: 'object',
          required: ['recipeId', 'ingredientId', 'value', 'unit'],
          properties: {
            recipeId: { type: 'integer', example: 1 },
            ingredientId: { type: 'integer', example: 1 },
            value: { type: 'number', example: 200 },
            unit: { type: 'string', example: 'grams' },
            comment: { type: 'string', example: 'al dente' }
          }
        }
      }
    }    
  },
  apis: ['./app.js'],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Smart Recipe API Documentation",
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    docExpansion: 'list'
  }
};

export { specs, swaggerUi, swaggerOptions };