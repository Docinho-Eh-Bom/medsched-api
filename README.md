# 🩺 MedSched

API REST para gerenciamento de **consultas médicas**, com autenticação via JWT, documentação com Swagger e banco de dados em SQLite.

## 🛠 Tecnologias utilizadas

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)  
- ![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=&logoColor=white)  
- ![JWT](https://img.shields.io/badge/JWT-F50000?style=for-the-badge&logo=json-web-tokens&logoColor=white)  
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)  
- ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)  

## 📚 Documentação da API

A documentação Swagger está disponível em:
http://localhost:3000/api-docs#/


## 🔐 Autenticação

A API utiliza autenticação via JWT.  
Após o login, inclua o token no header `Authorization` para acessar as rotas protegidas:<br>
Ex:<br>
Authorization: Bearer < token > <br>
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...




## 📌 Endpoints principais

### 1. 🧾 Autenticação

#### 1. Autenticação:

Registra um novo usuário (paciente ou médico)
```json title:POST_/auth/register
//Patient example
{
  "firstName": "Fulano",
  "lastName": "Silva",
  "email": "fulano@gmail.com",
  "password": "supersenha123",
  "role": "patient",
  "patientData": {
    "cpf": "12345678901",
    "birthDate": "2001-01-01",
    "cellphone": "5199887766"
  }
}
```
```json title:Resposta(201_Created)
{
  "id": "uuid",
  "firstName": "Fulano",
  "lastName": "Silva",
  "email": "fulano@gmail.com",
  "role": "patient"
}
```

Autentica um usuário
```json title:POST_/auth/login
//Patient example
{
  "email": "fulano@gmail.com",
  "password": "supersenha123"
}
```
```json title:Resposta(200_Ok)
{
  "token": "jwt.token.here",
  "user": {
    "id": "uuid",
    "firstName": "Fulano",
    "lastName": "Silva",
    "email": "fulano@gmail.com",
    "role": "patient"
  }
}
```

---
#### 2. Gerenciamento de Consultas:

Lista consultas do usuário (paciente/médico) ou todas (admin)
```json title:GET_/consults
//Resposta(200_Ok)
[
  {
    "id": "uuid",
    "date": "2025-11-15T14:30:00Z",
    "status": "scheduled",
    "patient": {
      "id": "uuid",
      "firstName": "Fulano",
      "lastName": "Silva"
    },
    "medic": {
      "id": "uuid",
      "firstName": "Beltrana ",
      "lastName": "Silveira"
    }
  }
]
```

Agenda nova consulta (paciente)
```json title:POST_/consult
{
  "medicId": "uuid-do-medico",
  "date": "2025-11-15T14:30:00Z"
}
```
```json title:Resposta(201_Created)
{
  "id": "uuid",
  "date": "2025-11-15T14:30:00Z",
  "status": "scheduled",
  "patientId": "uuid",
  "medicId": "uuid"
}
```

Atualiza consultas (cancelada/completada)
```json title:PATCH_/consults/:id/cancel
{
  "id": "uuid",
  "status": "cancelled"
}
```
```json title:PATCH_consults/:id/complete
{
  "id": "uuid",
  "status": "completed"
}
```

#### 3. Gerenciamento de Médicos:
Lista todos médicos (disponível para todos)
```json title:GET_/medics
//resposta(200_ok)
[
  {
    "id": "uuid",
    "firstName": "Beltrana ",
    "lastName": "Silveira",
    "speciality": "Psiquiatria",
    "availableSlots": [
      "2025-11-15T09:00:00Z",
      "2025-11-15T10:00:00Z"
    ]
  }
]
```

Adiciona horários disponivéis para os médicos (médico/admin)
```json title:POST_/medics/:id/slots
{
  "slot": "2025-12-16T09:00:00Z"
}

```

#### 4. Gerenciamento de Usuários:
**GET /users**  
Lista todos usuários (apenas admin)

**POST /users**  
Cria novo usuário (apenas admin)

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


