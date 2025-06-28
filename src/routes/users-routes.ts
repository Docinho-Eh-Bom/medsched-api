import { asyncHandler } from './../middlewares/asyncHandles.js';
import { Router } from "express";
import { UsersController } from "../controllers/users-controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { registerSchema } from "../schema/auth-schema.js";
import {  userRoleValidation } from "../schema/users-schema.js";

const router = Router();
const controller = new UsersController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
//list all users(admins only)
router.get("/",authenticate, 
    authorize('admin'),
    asyncHandler(controller.listAll.bind(controller)));


/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by Id
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the user to retrieve
 *     responses:
 *       200:
 *         description: Found user by Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid or missing Id/token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only admins and the user of that Id can access
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
//get by id(admin or user of that id)
router.get("/:id", authenticate,
    authorize('admin', 'patient'),
    asyncHandler(controller.getUserById.bind(controller)));

/**
 * @swagger
 * /users/{medicId}/slots:
 *   post:
 *     summary: Add a new available slot for a medic
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the medic to add the slot for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slot:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-01T14:00:00Z"
 *     responses:
 *       201:
 *         description: Slot added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Slot created successfully"
 *       400:
 *         description: Bad Request (e.g., missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
//add medic slot
router.post("/:userId/slots", authenticate,
    authorize('medic', 'admin'),
    validate({ body: userRoleValidation.addMedicSlot }),
    asyncHandler(controller.addMedicSlot.bind(controller)));



/**
 * @swagger
 * /users/{medicId}/slots:
 *   get:
 *     summary: Get all available slots for a medic by their Id
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the medic to get the slots for
 *     responses:
 *       200:
 *         description: List of available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-01T14:00:00Z"
 *       400:
 *         description: Bad Request (e.g., missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
//get medic slots
router.get("/:userId/slots", authenticate,
    authorize('medic','patient', 'admin'),
    asyncHandler(controller.getMedicSlots.bind(controller)));


/**
 * @swagger
 * /users/users:
 *   post:
 *     summary: Create a new user 
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf: 
 *               - $ref: '#/components/schemas/AdminRegister'
 *               - $ref: '#/components/schemas/PatientRegister'
 *               - $ref: '#/components/schemas/MedicRegister'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad Request (e.g., validation errors)
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
//create user (admin only)
router.post("/users", authenticate,
    authorize('admin'),
    validate({ body: registerSchema }),
    asyncHandler(controller.createUser.bind(controller)));


/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update user data 
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Bad request - Invalid fields
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
 *         description: Forbidden - Only admins or the user themselves can perform this action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
//update user (admin or user of that id)
router.patch("/:userId", authenticate,
    validate({ body: userRoleValidation.updateUserSchema }),
    asyncHandler(controller.updateUser.bind(controller)));


/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user 
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad request - Invalid or missing user Id
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
 *         description: Forbidden - Only admins or the user themselves can perform this action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
//delete user (admin or user of that id)
router.delete("/:userId", authenticate,
    authorize('admin', 'patient', 'medic'),
    asyncHandler(controller.deleteUser.bind(controller)));

export { router as usersRoutes };