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
      {
        url: 'https://medsched-api.onrender.com',
        description: 'Servidor em produção (Render)',
        },
    ],
  },
    apis: [
    './src/routes/**/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;

export function setupSwagger(app: Express) {
  app.use('/medsched-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
