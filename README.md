# MedSched

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)  ![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=&logoColor=white)  ![JWT](https://img.shields.io/badge/JWT-F50000?style=for-the-badge&logo=json-web-tokens&logoColor=white)  ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)  ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)  

Projeto final para matéria de **Serviços Web**.<br>
API REST para gerenciamento de **consultas médicas**, com autenticação via JWT, documentação com Swagger e banco de dados em SQLite.

## Documentação da API

Acesse a documentação em: `https://medsched-api.onrender.com/medsched-api-docs`


## Autenticação

A API utiliza autenticação via JWT.  
Após o login, inclua o token no header `Authorization` para acessar as rotas protegidas:  
Exemplo:  
```
Authorization: Bearer <token>
```
