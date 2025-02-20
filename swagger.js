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

export { specs, swaggerUi };