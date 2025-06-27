import { asyncHandler } from './../middlewares/asyncHandles.js';
import { Router } from "express";
import { UsersController } from "../controllers/users-controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { registerSchema } from "../schema/auth-schema.js";
import {  userRoleValidation } from "../schema/users-schema.js";

const router = Router();
const controller = new UsersController();

//list all users(admins only)
router.get("/",authenticate, 
    authorize('admin'),
    asyncHandler(controller.listAll.bind(controller)));

//get by id(admin or user of that id)
router.get("/:id", authenticate,
    authorize('admin', 'patient'),
    asyncHandler(controller.getUserById.bind(controller)));

//add medic slot
router.post("/:userId/slots", authenticate,
    authorize('medic', 'admin'),
    validate({ body: userRoleValidation.addMedicSlot }),
    asyncHandler(controller.addMedicSlot.bind(controller)));

//get medic slots
router.get("/:userId/slots", authenticate,
    authorize('medic','patient', 'admin'),
    asyncHandler(controller.getMedicSlots.bind(controller)));
    
//create user (admin only)
router.post("/users", authenticate,
    authorize('admin'),
    validate({ body: registerSchema }),
    asyncHandler(controller.createUser.bind(controller)));

//update user (admin or user of that id)
router.patch("/:userId", authenticate,
    validate({ body: userRoleValidation.updateUserSchema }),
    asyncHandler(controller.updateUser.bind(controller)));

//delete user (admin or user of that id)
router.delete("/:userId", authenticate,
    authorize('admin', 'patient', 'medic'),
    asyncHandler(controller.deleteUser.bind(controller)));

export { router as usersRoutes };