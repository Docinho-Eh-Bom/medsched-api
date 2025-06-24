import { Request, Response } from "express";
import { UserService } from "../services/users-service";
import { loginSchema, registerSchema } from "../schema/auth-schema";

export class AuthController{
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    //login
    async login(req: Request, res: Response): Promise<Response> {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid login data", details: parsed.error.errors });
        }

        const { email, password } = parsed.data;

        const result = await this.service.login(email, password);
        return res.status(200).json(result);
    }

    //register
    async register(req: Request, res: Response): Promise<Response> {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid registration data", details: parsed.error.errors });
        }

        const result = await this.service.createUser(parsed.data);
        return res.status(201).json(result);
    }

    //current user
    async currentUser(req: Request, res: Response): Promise<Response> {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await this.service.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({user: user});
    }
}