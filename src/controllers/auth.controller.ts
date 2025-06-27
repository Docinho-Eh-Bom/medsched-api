import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users-service.js";
import { APIError } from "../errors/api-error.js";
import { sendSuccess } from "../utils/response.js";
import { send } from "process";

export class AuthController{
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    //login
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        const result = await this.service.login(email, password);
        if (!result) {
            throw new APIError("Invalid email or password", 401);
        }
        sendSuccess(res, "Login successful", { token: result.token });
    }

    //register
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.service.createUser(req.body);
        if (!result) {
            throw new APIError("User registration failed", 400);
        }
        sendSuccess(res, "User registered successfully", { user: result });
    }

    //current user
    async currentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user) {
            throw new APIError("Unauthorized", 401);
        }

        const user = await this.service.getUserById(req.user.userId);
        if (!user) {
            throw new APIError("User not found", 404);
        }

        sendSuccess(res, "Current user retrieved successfully", { user });
    }
}