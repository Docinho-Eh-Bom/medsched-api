import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/users-service.js";
import {  userRoleSchema } from "../schema/users-schema.js";
import { APIError } from "../errors/api-error.js";


export class UsersController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    //create user
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const createdUser = await this.userService.createUser(req.body);
        if (!createdUser) {
            throw new APIError("Failed to create user", 500);
        }
        
        res.status(201).json({createdUser});
    }

    //update user
    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.userId;
        if (!id) {
            throw new APIError("Invalid request: User ID is required.", 400);
        }        

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        if (req.user.role !== 'admin' && req.user.userId !== id) {
            throw new APIError("Forbidden: You don't have permission to update this user.", 403);
        }

        const updatedUser = await this.userService.updateUser(id, req.body, req.user.userId, req.user.role);

        if (!updatedUser) {
            throw new APIError("Failed to update user", 500);
        }

        res.status(200).json({updatedUser});
    }

    //get user by id
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        if (!id) {
            throw new APIError("Invalid request: User ID is required.", 400);
        }

        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new APIError("User not found", 404);
        }

        res.status(200).json({user});
    }

    //list by role
    async listByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        const role = req.params.role;
        if (!role) {
            throw new APIError("Invalid request: Role is required.", 400);
        }

        const parsedRole = userRoleSchema.safeParse(role);
        if (!parsedRole.success){
            throw new APIError("Invalid role format", 400, parsedRole.error.flatten());
        }

        if (!req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        const users = await this.userService.listByRole(parsedRole.data, req.user.role);
        res.status(200).json({users});
    }

    //lis all users (admins only)
    async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user?.role || req.user.role !== 'admin') {
            throw new APIError("Forbidden: Only admins can list all users.", 403);
        }

        const users = await this.userService.listAll(req.user.role);
        res.status(200).json({users});
    }

    //add medic slot
    async addMedicSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(req.body);
        const medicId = req.params.userId;
        console.log("MedicId:", medicId);

        if (!medicId) {
            throw new APIError("Invalid request: User ID is required.", 400);
        }

        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== medicId)){
            throw new APIError("Forbidden: You don't have permission to add medic slots.", 403);
        }

        const slotData = req.body;
        const addedSlot = await this.userService.addMedicAvailableSlot(medicId, slotData.slot);
        if (!addedSlot) {
            throw new APIError("Failed to add medic slot", 500);
        }

        res.status(201).json({addedSlot});
    }

    //get medic slots
    async getMedicSlots(req: Request, res: Response, next: NextFunction): Promise<void>{
        const medicId = req.params.userId;
        if (!medicId) {
            throw new APIError("Invalid request: User ID is required.", 400);
        }
        
        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== medicId)){
            throw new APIError("Forbidden: You don't have permission to view medic slots.", 403);
        }

        const slots = await this.userService.getMedicAvailableSlots(medicId);
        if (!slots || slots.length === 0) {
            throw new APIError("No slots found for this medic", 404);
        }

        res.status(200).json({slots});
    }

    //delete user
    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.userId;
        if (!id) {
            throw new APIError("Invalid request: User ID is required.", 400);
        }

        if (!req.user?.userId || !req.user?.role) {
            throw new APIError("Unauthorized: Missing user credentials.", 401);
        }

        if (req.user.role !== 'admin' && req.user.userId !== id) {
            throw new APIError("Forbidden: You don't have permission to delete this user.", 403);
        }

        const deletedUser = await this.userService.deleteUser(id, req.user.userId, req.user.role);
        res.status(200).json({message: "User deleted successfully", deletedUser});
    }
}