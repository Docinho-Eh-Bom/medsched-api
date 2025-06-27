import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { components } from './components.js';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MedSched API',
      version: '1.0.0',
      description: 'Documentação da API de agendamentos médicos feita para as disciplinas de Serviços Web e Desenvolvimento Mobile 2.'
    },
    components,
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
    apis: [
    './src/routes/**/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/medsched-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
