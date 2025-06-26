import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/users-service";
import { userRoleValidation, userRoleSchema } from "../schema/users-schema";

export class UsersController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    //create user
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const createdUser = await this.userService.createUser(req.body);
        if (!createdUser) {
            res.status(500).json({
                message: "Failed to create user",
            });
            return;
        }
        
        res.status(201).json({
            message: "User created successfully",
            user: createdUser,
        });
    }

    //update user
    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.userId;
        if (!id) {
            res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
            return;
        }        

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        if (req.user.role !== 'admin' && req.user.userId !== id) {
            res.status(403).json({
                message: "Forbidden: You don't have permission to update this user.",
            });
            return;
        }

        const updatedUser = await this.userService.updateUser(id, req.body, req.user.userId, req.user.role);

        if (!updatedUser) {
            res.status(404).json({
                message: "User not found or update failed",
            });
            return;
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    }

    //get user by id
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
            return;
        }

        const user = await this.userService.getUserById(id);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user,
        });
    }

    //list by role
    async listByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        const role = req.params.role;
        if (!role) {
            res.status(400).json({
                message: "Invalid request: Role is required.",
            });
            return;
        }

        const parsedRole = userRoleSchema.safeParse(role);
        if (!parsedRole.success){
            res.status(403).json({
                message: "Forbidden: You don't have permission to list users by role.",
            });
            return;
        }

        if (!req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
            return;
        }

        const users = await this.userService.listByRole(parsedRole.data, req.user.role);
        res.status(200).json({
            message: "Users retrieved successfully",
            users,
        });
    }

    //lis all users (admins only)
    async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user?.role || req.user.role !== 'admin') {
            res.status(403).json({
                message: "Forbidden: You don't have permission to list all users.",
            });
            return;
        }

        const users = await this.userService.listAll(req.user.role);
        res.status(200).json({
            message: "Users retrieved successfully",
            users,
        });
    }

    //add medic slot
    async addMedicSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(req.body);
        const medicId = req.params.userId;
        console.log("MedicId:", medicId);

        if (!medicId) {
            res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
            return;
        }

        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== medicId)){
            res.status(403).json({
                message: "Forbidden: You don't have permission to add slots for this medic.",
            });
            return;
        }

        const slotData = req.body;
        const addedSlot = await this.userService.addMedicAvailableSlot(medicId, slotData.slot);
        if (!addedSlot) {
            res.status(500).json({
                message: "Failed to add medic slot",
            });
            return;
        }

        res.status(201).json({
            message: "Medic slot added successfully",
            slot: addedSlot,
        });
    }

    //get medic slots
    async getMedicSlots(req: Request, res: Response, next: NextFunction): Promise<void>{
        const medicId = req.params.userId;
        if (!medicId) {
            res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
            return;
        }
        
        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== medicId)){
            res.status(403).json({
                message: "Forbidden: You don't have permission to  access medic slots.",
            });
            return;
        }

        const slots = await this.userService.getMedicAvailableSlots(medicId);
        if (!slots || slots.length === 0) {
            res.status(404).json({
                message: "No slots found for the specified medic.",
            });
            return;
        }

        res.status(200).json({
            message: "Medic slots retrieved successfully",
            slots,
        });
    }

    //delete user
    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.userId;
        if (!id) {
            res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
            return;
        }

        if (!req.user?.userId || !req.user?.role) {
            res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
        return;
        }

        if (req.user.role !== 'admin' && req.user.userId !== id) {
            res.status(403).json({
                message: "Forbidden: You don't have permission to delete this user.",
            });
            return;
        }

        const deletedUser = await this.userService.deleteUser(id, req.user.userId, req.user.role);
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    }
}