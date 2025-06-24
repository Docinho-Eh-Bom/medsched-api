import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users-service";
import { loginSchema, registerSchema } from "../schema/auth-schema";

export class AuthController{
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    //login
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Invalid login data", details: parsed.error.errors });
            return;
        }

        const { email, password } = parsed.data;

        const result = await this.service.login(email, password);
        res.status(200).json(result);
    }

    //register
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Invalid registration data", details: parsed.error.errors });
            return;
        }

        const result = await this.service.createUser(parsed.data);
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