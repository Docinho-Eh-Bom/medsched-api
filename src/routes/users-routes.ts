import { asyncHandler } from './../middlewares/asyncHandles';
import { Router } from "express";
import { UsersController } from "../controllers/users-controller";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import {  userRoleValidation } from "../schema/users-schema";

const router = Router();
const controller = new UsersController();

//list all users(admins only)
router.get("/users",authenticate, 
    authorize('admin'),
    asyncHandler(controller.listAll.bind(controller)));

//get by id(admin or user of that id)
router.get("/:id", authenticate,
    asyncHandler(controller.getUserById.bind(controller)));
    
//create user (admin only)
router.post("/users", authenticate,
    authorize('admin'),
    validate({ body: userRoleValidation.createUserSchema }),
    asyncHandler(controller.createUser.bind(controller)));

//update user (admin or user of that id)
router.put("/:id", authenticate,
    validate({ body: userRoleValidation.updateUserSchema }),
    asyncHandler(controller.updateUser.bind(controller)));

//delete user (admin or user of that id)
router.delete("/:id", authenticate,
    authorize('admin', 'patient', 'medic'),
    asyncHandler(controller.deleteUser.bind(controller)));

export { router as usersRoutes };