# 🩺 MedSched

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)  ![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=&logoColor=white)  ![JWT](https://img.shields.io/badge/JWT-F50000?style=for-the-badge&logo=json-web-tokens&logoColor=white)  ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)  ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)  

Projeto final para matéria de **Serviços Web**.<br>
API REST para gerenciamento de **consultas médicas**, com autenticação via JWT, documentação com Swagger e banco de dados em SQLite.

## 📚 Documentação da API

A documentação Swagger está disponível em:
http://localhost:3000/medsched-api-docs/


## 🔐 Autenticação

A API utiliza autenticação via JWT.  
Após o login, inclua o token no header `Authorization` para acessar as rotas protegidas:<br>
Ex:<br>
Authorization: Bearer < token > <br>
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## 📜 Scripts disponíveis
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx watch src/index.ts",
  "prisma_tables": "npx prisma studio"
}
```

## 📁 Estrutura de Pastas
```graphql
MedSched/
├── prisma/                 # Schema do banco de dados Prisma
├── src/
│   ├── @types/             # Tipagens globais
│   ├── config/             # Configurações de ambiente e inicialização
│   ├── controllers/        # Controladores das rotas
│   ├── errors/             # Classes de erro customizadas
│   ├── middlewares/        # Middlewares de autenticação, validação, etc.
│   ├── models/             # Modelos de domínio
│   ├── repositories/       # Acesso e manipulação de dados
│   ├── routes/             # Rotas da API
│   ├── schema/             # Schemas do Zod para validação
│   ├── services/           # Regras de negócio
│   ├── swagger/            # Configuração do Swagger
│   ├── utils/              # Funções utilitárias
│   └── index.ts            # Arquivo principal
```


