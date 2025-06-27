import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users-service.js";

export class AuthController{
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    //login
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        const result = await this.service.login(email, password);
        res.status(200).json(result);
    }

    //register
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.service.createUser(req.body);
        res.status(201).json(result);
    }

    //current user
    async currentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await this.service.getUserById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({user: user});
    }
}