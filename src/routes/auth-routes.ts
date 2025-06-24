import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../schema/auth-schema";
import { asyncHandler } from "../middlewares/asyncHandles";

const router = Router();
const controller = new AuthController();

router.post("/login",
    validate({body: loginSchema}), 
    asyncHandler(controller.login.bind(controller)));

router.post("/register",
    validate({body: registerSchema}),
    asyncHandler(controller.register.bind(controller)));

export {router as authRoutes};