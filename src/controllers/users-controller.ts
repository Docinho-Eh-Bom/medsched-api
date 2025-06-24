import { Request, Response } from "express";
import { UserService } from "../services/users-service";
import { userRoleValidation, userRoleSchema } from "../schema/users-schema";

export class UsersController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    //create user
    async createUser(req: Request, res: Response): Promise<Response> {
        const parseResult = userRoleValidation.createUserSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: parseResult.error.errors,
            });
        }

        const createdUser = await this.userService.createUser(parseResult.data);
        if (!createdUser) {
            return res.status(500).json({
                message: "Failed to create user",
            });
        }
        
        return res.status(201).json({
            message: "User created successfully",
            user: createdUser,
        });
    }

    //update user
    async updateUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const parseResult = userRoleValidation.updateUserSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: parseResult.error.errors,
            });
        }

        if (!req.user?.userId || !req.user?.role) {
            return res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
        }
        const updatedUser = await this.userService.updateUser(id, parseResult.data, req.user.userId, req.user.role);
        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    }

    //get user by id
    async getUserById(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
        }

        const user = await this.userService.getUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            user,
        });
    }

    //list by role
    async listByRole(req: Request, res: Response): Promise<Response> {
        const role = req.params.role;
        if (!role) {
            return res.status(400).json({
                message: "Invalid request: Role is required.",
            });
        }

        const parsedRole = userRoleSchema.safeParse(role);
        if (!parsedRole.success){
            return res.status(403).json({
                message: "Forbidden: You don't have permission to list users by role.",
            });
        }

        if (!req.user?.role) {
            return res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
        }

        const users = await this.userService.listByRole(parsedRole.data, req.user.role);
        return res.status(200).json({
            message: "Users retrieved successfully",
            users,
        });
    }

    //delete user
    async deleteUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "Invalid request: User ID is required.",
            });
        }

        if (!req.user?.userId || !req.user?.role) {
            return res.status(401).json({
                message: "Unauthorized: Missing user credentials.",
            });
        }

        const deletedUser = await this.userService.deleteUser(id, req.user.userId, req.user.role);
        return res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    }
}