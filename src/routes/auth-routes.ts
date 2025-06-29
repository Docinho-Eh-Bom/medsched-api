// import { Router } from "express";
// import { AuthController } from "../controllers/auth.controller.js";
// import { validate } from "../middlewares/validate.js";
// import { loginSchema, registerSchema } from "../schema/auth-schema.js";
// import { asyncHandler } from "../middlewares/asyncHandles.js";

// const router = Router();
// const controller = new AuthController();

// //login and register routes

// router.post("/login",
//     validate({body: loginSchema}), 
//     asyncHandler(controller.login.bind(controller)));


// router.post("/register",
//     validate({body: registerSchema}),
//     asyncHandler(controller.register.bind(controller)));

// export {router as authRoutes};