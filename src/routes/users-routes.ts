// import { asyncHandler } from './../middlewares/asyncHandles.js';
// import { Router } from "express";
// import { UsersController } from "../controllers/users-controller.js";
// import { validate } from "../middlewares/validate.js";
// //import { authenticate, authorize } from "../middlewares/auth.js";
// import { registerSchema } from "../schema/auth-schema.js";
// import {  userRoleValidation } from "../schema/users-schema.js";

// const router = Router();
// const controller = new UsersController();

// //list all users(admins only)
// router.get("/",authenticate, 
//     asyncHandler(controller.listAll.bind(controller)));


// //add medic slot
// router.post("/:userId/slots", authenticate,
//     validate({ body: userRoleValidation.addMedicSlot }),
//     asyncHandler(controller.addMedicSlot.bind(controller)));


// //get medic slots
// router.get("/:userId/slots", authenticate,
//     asyncHandler(controller.getMedicSlots.bind(controller)));


// //create user (admin only)
// router.post("/users", authenticate,
//     validate({ body: registerSchema }),
//     asyncHandler(controller.createUser.bind(controller)));



// //update user (admin or user of that id)
// router.patch("/:userId", authenticate,
//     validate({ body: userRoleValidation.updateUserSchema }),
//     asyncHandler(controller.updateUser.bind(controller)));


// //delete user (admin or user of that id)
// router.delete("/:userId", authenticate,
//     asyncHandler(controller.deleteUser.bind(controller)));

// export { router as usersRoutes };