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

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/medsched.git
   cd medsched
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:  
   Crie um arquivo `.env` na raiz do projeto e configure as variáveis, especialmente o `JWT_SECRET`.

   ```bash
   #Sua porta onde a aplicação irá rodar  
   PORT=3000
   #JSegredo para a geração dos tokens JWT
   JWT_SECRET="YourSecretHere"
   #Caminho para o arquivo para a database SQLite
   DATABASE_URL="file:./dev.db"
   ```

## Geração do banco de dados

Execute as migrations para criar as tabelas do banco SQLite:
   ```bash
   npx prisma migrate dev --name init
   ```

  Se quiser, abra a interface gráfica do Prisma Studio para visualizar os dados:
   ```bash
   npm run prisma_tables
   ```


## Executando a aplicação

```bash
# Em modo desenvolvimento
npm run dev

# Para buildar e rodar a versão compilada
npm run build
npm start
```

## Scripts
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx watch src/index.ts",
  "prisma_tables": "npx prisma studio",
  "create:users": "npm run build && node dist/scripts/create-users.js"
}
```

## Usuários Iniciais

```bash
# Script para criar 3 usuários iniciais: admin, patient, medic
npm run create:users
```

## Estrutura de Pastas
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
|   ├── scripts/            # Scripts da API
│   ├── services/           # Regras de negócio
│   ├── swagger/            # Configuração do Swagger
│   ├── utils/              # Funções utilitárias
│   └── index.ts            # Arquivo principal
```

