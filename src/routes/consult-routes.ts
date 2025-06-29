// import { Router } from "express";
// import { asyncHandler } from "../middlewares/asyncHandles.js";
// import { ConsultController } from "../controllers/consult-controller.js";
// //import { authenticate, authorize } from "../middlewares/auth.js";
// import { validate } from "../middlewares/validate.js";
// import { CreateConsultSchema, UpdateConsultStatusSchema, UpdateConsultNotesSchema } from "../schema/consult-schema.js";

// const router = Router();
// const controller = new ConsultController();

// //create consult
// router.post("/", authenticate,
//     validate({body: CreateConsultSchema}),
//     asyncHandler(controller.createConsult.bind(controller))
// );

// //list consults by status
// router.get("/status/:status", authenticate,
//     asyncHandler(controller.listByStatus.bind(controller))
// );

// //get consult by id
// router.get("/:id", authenticate,
//     asyncHandler(controller.getById.bind(controller))
// );


// //update consult status
// router.patch("/:id/status", authenticate,
//     validate({body: UpdateConsultStatusSchema}),
//     asyncHandler(controller.updateConsultStatus.bind(controller))
// );

// //cancel consult
// router.patch("/:id/cancel", authenticate,
//     validate({body: UpdateConsultStatusSchema}),
//     asyncHandler(controller.updateConsultStatus.bind(controller))
// );

// //add notes to the consult
// router.patch("/:id/notes", authenticate,
//     validate({body: UpdateConsultNotesSchema}),
//     asyncHandler(controller.addNotes.bind(controller))
// );

// //delete consult
// router.delete("/:id", authenticate,
//     asyncHandler(controller.deleteConsult.bind(controller))
// );

// export {router as consultRoutes};

