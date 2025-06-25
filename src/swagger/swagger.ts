import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MedSched API',
    version: '1.0.0',
    description: 'Documentação da API de agendamentos médicos',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: [
    './src/routes/**/*.ts',        // ← rotas com @openapi
    './src/swagger/components.ts', // ← schemas externos
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/medsched-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
