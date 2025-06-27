import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../schema/auth-schema.js";
import { asyncHandler } from "../middlewares/asyncHandles.js";

const router = Router();
const controller = new AuthController();

//login and register routes

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Rotas de autenticação e registro
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login de usuário
 *     description: Faz login com email e senha, retorna token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "genoveva@email.com"
 *               password:
 *                 type: string
 *                 example: "12345+A"
 *     responses:
 *       200:
 *         description: Login bem-sucedido com token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: "Requisição inválida (ex: dados incompletos)."
 *       401:
 *         description: "Credenciais inválidas."
 */
router.post("/login",
    validate({body: loginSchema}), 
    asyncHandler(controller.login.bind(controller)));



/**
 * @openapi
 * /auth/register/admin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de administrador
 *     description: Cria um novo usuário com o papel `admin`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegister'
 *     responses:
 *       201:
 *         description: Usuário admin criado com sucesso.
 *       400:
 *         description: Dados inválidos ou incompletos.
 */

/**
 * @openapi
 * /auth/register/medic:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de médico
 *     description: Cria um novo usuário com o papel `medic`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicRegister'
 *     responses:
 *       201:
 *         description: Usuário médico criado com sucesso.
 *       400:
 *         description: Dados inválidos ou incompletos.
 */

/**
 * @openapi
 * /auth/register/patient:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de paciente
 *     description: Cria um novo usuário com o papel `patient`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientRegister'
 *     responses:
 *       201:
 *         description: Usuário paciente criado com sucesso.
 *       400:
 *         description: Dados inválidos ou incompletos.
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de usuário (genérico)
 *     description: Rota real que aceita qualquer tipo de usuário com base no campo `role`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/AdminRegister'
 *               - $ref: '#/components/schemas/MedicRegister'
 *               - $ref: '#/components/schemas/PatientRegister'
 *             discriminator:
 *               propertyName: role
 *               mapping:
 *                 admin: '#/components/schemas/AdminRegister'
 *                 medic: '#/components/schemas/MedicRegister'
 *                 patient: '#/components/schemas/PatientRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post("/register",
    validate({body: registerSchema}),
    asyncHandler(controller.register.bind(controller)));

export {router as authRoutes};