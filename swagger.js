import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      },
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./app.js'],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Smart Recipe API Documentation",
  swaggerOptions: {
    persistAuthorization: true
  }
};

export { specs, swaggerUi, swaggerOptions };