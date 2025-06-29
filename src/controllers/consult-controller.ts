import { NextFunction, Request, Response } from "express";
import { ConsultService } from "../services/consult-service.js";
import { ConsultStatus, CreateConsultSchema, UpdateConsultStatusSchema } from "../schema/consult-schema.js";
import { APIError } from "../errors/api-error.js";


export class ConsultController {

    private consultService: ConsultService;

    constructor() {
        this.consultService = new ConsultService();
    }

    //create consult
    async createConsult(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parseResult = CreateConsultSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw new APIError("Invalid request data", 400, parseResult.error.flatten());
        }

        const { medicId, patientId, ...consultData } = parseResult.data;
        const createdConsult = await this.consultService.createConsult(
            { ...consultData, patientId, medicId },
            patientId,
            medicId
        );
        if (!createdConsult) {
            throw new APIError("Failed to create consult", 500);
        }

        res.status(201).json({createdConsult });
    }

    //update consult status
    async updateConsultStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const parseResult = UpdateConsultStatusSchema.safeParse(req.body);

        if (!parseResult.success) {
            throw new APIError("Invalid status update data", 400, parseResult.error.flatten());
        }

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const updatedConsult = await this.consultService.updateStatus(id, parseResult.data, req.user.userId, req.user.role);
        res.status(200).json({ updatedConsult });
    }

    //add notes to consult
    async addNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const notes = req.body.notes;

        if (!notes || typeof notes !== 'string' || notes.length > 1000) {
            throw new APIError("Invalid notes format. Notes must be a string with a maximum length of 1000 characters.", 400);
        }

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const updatedConsult = await this.consultService.addNotes(id, notes, req.user.userId, req.user.role);
        res.status(200).json({ updatedConsult });
    }

    //search consults by id
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const consults = await this.consultService.getById(id, req.user.userId, req.user.role);
        if (consults.length === 0) {
            throw new APIError("Consult not found or you don't have permission to view it.", 404);
        }

        res.status(200).json({ consults });
    }

    //list consults by patient id
    async getByPatientId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const patientId = req.params.patientId;

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const consults = await this.consultService.getByPatientId(patientId, req.user.userId, req.user.role);
        if (consults.length === 0) {
            throw new APIError("No consults found for this patient", 404);
        }

        res.status(200).json({ consults });
    }

    //list consults by medic id
    async getByMedicId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const medicId = req.params.medicId;

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const consults = await this.consultService.getByMedicId(medicId, req.user.userId, req.user.role);
        if (consults.length === 0) {
            throw new APIError("No consults found for this medic", 404);
        }

        res.status(200).json({ consults });
    }

    //list all consults
    async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const consults = await this.consultService.listAll(req.user.userId, req.user.role);
        if (consults.length === 0) {
            throw new APIError("No consults found", 404);
        }

        res.status(200).json({ consults });
    }

    //list consults by status
    async listByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const status = req.params.status as ConsultStatus;

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        if (req.user.role !== 'admin') {
            throw new APIError("Unauthorized: Only admins can list consults by status.", 403);
        }

        const consults = await this.consultService.listByStatus(status, req.user.userId, req.user.role);
        if (consults.length === 0) {
            throw new APIError(`No consults found with status ${status}`, 404);
        }

        res.status(200).json({ consults });
    }

    //delete consult
    async deleteConsult(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const deleted = await this.consultService.deleteConsult(id, req.user.userId, req.user.role);
        if (!deleted) {
            throw new APIError("Consult not found or you don't have permission to delete it.", 404);
        }

        res.status(200).json({ message: "Consult deleted successfully" });
    }   
}