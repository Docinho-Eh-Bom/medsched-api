import { NextFunction, Request, Response } from "express";
import { ConsultService } from "../services/consult-service";
import { CreateConsultSchema, UpdateConsultStatusSchema } from "../schema/consult-schema";

export class ConsultController {

    private consultService: ConsultService;

    constructor() {
        this.consultService = new ConsultService();
    }

    //create consult
    async createConsult(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parseResult = CreateConsultSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Invalid request data",
                errors: parseResult.error.errors,
            });
            return;
        }

        const { medicId, patientId, ...consultData } = parseResult.data;
        const createdConsult = await this.consultService.createConsult(
            { ...consultData, patientId, medicId },
            patientId,
            medicId
        );
        if (!createdConsult) {
            res.status(500).json({
                message: "Failed to create consult",
            });
            return;
        }

        res.status(201).json({
            message: "Consult created successfully",
            consult: createdConsult,
        });
    }

    //update consult status
    async UpdateConsultStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const parseResult = UpdateConsultStatusSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({
                message: "Invalid request data",
                errors: parseResult.error.errors,
            });
            return;
        }

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const updatedConsult = await this.consultService.updateStatus(id, parseResult.data, req.user.userId, req.user.role);
        res.status(200).json({
            message: "Consult status updated successfully",
            consult: updatedConsult,
        });
    }

    //add notes to consult
    async addNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const notes = req.body.notes;

        if (!notes || typeof notes !== 'string' || notes.length > 1000) {
            res.status(400).json({
                message: "Invalid notes. Notes must be a string with a maximum length of 1000 characters.",
            });
            return;
        }

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const updatedConsult = await this.consultService.addNotes(id, notes, req.user.userId, req.user.role);
        res.status(200).json({
            message: "Notes added successfully",
            consult: updatedConsult,
        });
    }

    //search consults by id
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const consults = await this.consultService.getById(id, req.user.userId, req.user.role);
        if (consults.length === 0) {
            res.status(404).json({
                message: "Consult not found",
            });
            return;
        }

        res.status(200).json({
            message: "Consult retrieved successfully",
            consults,
        });
    }

    //list consults by patient id
    async getByPatientId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const patientId = req.params.patientId;

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const consults = await this.consultService.getByPatientId(patientId, req.user.userId, req.user.role);
        if (consults.length === 0) {
            res.status(404).json({
                message: "No consults found for this patient",
            });
            return;
        }

        res.status(200).json({
            message: "Consults retrieved successfully",
            consults,
        });
    }

    //list consults by medic id
    async getByMedicId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const medicId = req.params.medicId;

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const consults = await this.consultService.getByMedicId(medicId, req.user.userId, req.user.role);
        if (consults.length === 0) {
            res.status(404).json({
                message: "No consults found for this medic",
            });
            return;
        }

        res.status(200).json({
            message: "Consults retrieved successfully",
            consults,
        });
    }

    //delete consult
    async deleteConsult(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const deleted = await this.consultService.deleteConsult(id, req.user.userId, req.user.role);
        if (!deleted) {
            res.status(404).json({
                message: "Consult not found or you don't have permission to delete it.",
            });
            return;
        }

        res.status(200).json({
            message: "Consult deleted successfully",
        });
    }   
}