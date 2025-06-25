import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandles";
import { ConsultController } from "../controllers/consult-controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { CreateConsultSchema, UpdateConsultStatusSchema } from "../schema/consult-schema";

const router = Router();
const controller = new ConsultController();

//create consult
router.post("/consults", authenticate,
    authorize("patient", "admin"),
    validate({body: CreateConsultSchema}),
    asyncHandler(controller.createConsult.bind(controller))
);

//get all consults
router.get("/consults", authenticate,
    authorize("admin"),
    asyncHandler(controller.listAll.bind(controller))
);

//list consults by status
router.get("/consults/status/:status", authenticate,
    authorize("medic", "admin"),
    asyncHandler(controller.listByStatus.bind(controller))
);

//get consult by id
router.get("/consults/:id", authenticate,
    authorize("patient", "medic", "admin"),
    asyncHandler(controller.getById.bind(controller))
);

//get consults by patient id
router.get("/consults/patient/:patientId", authenticate,
    authorize("patient", "medic", "admin"),
    asyncHandler(controller.getByPatientId.bind(controller))
);

//get consults by medic id
router.get("/consults/medic/:medicId", authenticate,
    authorize("medic", "admin"),
    asyncHandler(controller.getByMedicId.bind(controller))
);

//update consult status
router.patch("/consults/:id/status", authenticate,
    authorize("medic", "admin"),
    validate({body: UpdateConsultStatusSchema}),
    asyncHandler(controller.updateConsultStatus.bind(controller))
);

//add notes to the consult
router.patch("/consults/:id/notes", authenticate,
    authorize("medic", "admin"),
    validate({body: UpdateConsultStatusSchema}),
    asyncHandler(controller.addNotes.bind(controller))
);

//delete consult
router.delete("/consults/:id", authenticate,
    authorize("admin"),
    asyncHandler(controller.deleteConsult.bind(controller))
);

export {router as consultRoutes};

