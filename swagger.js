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
        url: 'https://humble-transformation-production.up.railway.app',
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
            enum: ['mysql', 'mongodb']
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
          properties: {
            id: { 
              oneOf: [
                { type: 'integer' },
                { type: 'string' }
              ]
            },
            title: { type: 'string' },
            description: { type: 'string' },
            ingredients: { 
              type: 'array',
              items: { type: 'string' }
            },
            instructions: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { 
              oneOf: [
                { type: 'integer' },
                { type: 'string' }
              ]
            },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        Ingredient: {
          type: 'object',
          properties: {
            id: { 
              oneOf: [
                { type: 'integer' },
                { type: 'string' }
              ]
            },
            name: { type: 'string' },
            quantity: { type: 'string' }
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