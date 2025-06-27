import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import dotenv from 'dotenv';
import { UserRole } from "../models/user.js";

dotenv.config();

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedError("No token provided.");

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "";

    try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = {
        userId: payload.userId,
        role: payload.role
    };
    next();
    } catch (err) {
        throw new UnauthorizedError("Invalid token.");
    }
}

export function authorize(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user || !roles.includes(req.user.role)){
            throw new UnauthorizedError("Access denied.");
        }
    next();
    };
}