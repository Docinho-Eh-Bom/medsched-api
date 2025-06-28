import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandles.js";
import { ConsultController } from "../controllers/consult-controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { CreateConsultSchema, UpdateConsultStatusSchema, UpdateConsultNotesSchema } from "../schema/consult-schema.js";

const router = Router();
const controller = new ConsultController();

/**
 * @swagger
 * /consults:
 *   post:
 *     summary: Create a new consult
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConsult'
 *     responses:
 *       201:
 *         description: Consult created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consult created successfully"
 *                 consult:
 *                   $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only patients or admins can create consults
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//create consult
router.post("/", authenticate,
    authorize("patient", "admin"),
    validate({body: CreateConsultSchema}),
    asyncHandler(controller.createConsult.bind(controller))
);


/**
 * @swagger
 * /consults:
 *   get:
 *     summary: List all consults
 *     tags: 
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all consults
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//get all consults
router.get("/", authenticate,
    authorize("admin"),
    asyncHandler(controller.listAll.bind(controller))
);

/**
 * @swagger
 * /consults/status/{status}:
 *   get:
 *     summary: List all consults filtered by status
 *     tags: 
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELLED]
 *         description: Status to filter consults by
 *     responses:
 *       200:
 *         description: List of consults with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing status/token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only medics or admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//list consults by status
router.get("/status/:status", authenticate,
    authorize("medic", "admin"),
    asyncHandler(controller.listByStatus.bind(controller))
);

/**
 * @swagger
 * /consults/{id}:
 *   get:
 *     summary: Get a consult by its Id
 *     tags: 
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the consult to retrieve
 *     responses:
 *       200:
 *         description: Consult found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only authorized users can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consult not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//get consult by id
router.get("/:id", authenticate,
    authorize("patient", "medic", "admin"),
    asyncHandler(controller.getById.bind(controller))
);


/**
 * @swagger
 * /consults/patient/{patientId}:
 *   get:
 *     summary: Get all consults for a patient by their Id
 *     tags: 
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the patient whose consults to retrieve
 *     responses:
 *       200:
 *         description: List of consults for the specified patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing patient Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only the patient, their medic, or an admin can access this data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Patient or consults not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//get consults by patient id
router.get("/patient/:patientId", authenticate,
    authorize("patient", "medic", "admin"),
    asyncHandler(controller.getByPatientId.bind(controller))
);


/**
 * @swagger
 * /consults/medic/{medicId}:
 *   get:
 *     summary: Get all consults for a specific medic by their Id
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the medic whose consults to retrieve
 *     responses:
 *       200:
 *         description: List of consults for the specified medic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Bad request - Invalid or missing medic Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only medics or admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Medic or consults not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//get consults by medic id
router.get("/medic/:medicId", authenticate,
    authorize("medic", "admin"),
    asyncHandler(controller.getByMedicId.bind(controller))
);

/**
 * @swagger
 * /consults/{id}/status:
 *   patch:
 *     summary: Update the status of a consult by its Id
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the consult to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateConsultStatus'
 *     responses:
 *       200:
 *         description: Consult status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consult status updated successfully"
 *       400:
 *         description: Bad request - Invalid or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only medics or admins can update consult status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consult not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//update consult status
router.patch("/:id/status", authenticate,
    authorize("medic", "admin"),
    validate({body: UpdateConsultStatusSchema}),
    asyncHandler(controller.updateConsultStatus.bind(controller))
);


/**
 * @swagger
 * /consults/{id}/cancel:
 *   patch:
 *     summary: Cancel a consult by its Id
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the consult to cancel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelConsult'
 *     responses:
 *       200:
 *         description: Consult cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consult cancelled successfully"
 *       400:
 *         description: Bad request - Invalid or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only the patient, their medic, or an admin can cancel a consult
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consult not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//cancel consult
router.patch("/:id/cancel", authenticate,
    authorize("patient", "medic", "admin"),
    validate({body: UpdateConsultStatusSchema}),
    asyncHandler(controller.updateConsultStatus.bind(controller))
);

/**
 * @swagger
 * /consults/{id}/notes:
 *   patch:
 *     summary: Add notes for a consult by its Id
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the consult to add notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddNotesToTheConsult'
 *     responses:
 *       200:
 *         description: Notes added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes added successfully"
 *       400:
 *         description: Bad request - Invalid or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only medics or admins can add notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consult not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//add notes to the consult
router.patch("/:id/notes", authenticate,
    authorize("medic", "admin"),
    validate({body: UpdateConsultNotesSchema}),
    asyncHandler(controller.addNotes.bind(controller))
);

/**
 * @swagger
 * /consults/{id}:
 *   delete:
 *     summary: Delete a consult by its Id
 *     tags:
 *       - Consults
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the consult to delete
 *     responses:
 *       200:
 *         description: Consult deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consult deleted successfully"
 *       400:
 *         description: Bad request - Invalid or missing Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only admins can delete consults
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consult not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//delete consult
router.delete("/:id", authenticate,
    authorize("admin"),
    asyncHandler(controller.deleteConsult.bind(controller))
);

export {router as consultRoutes};

