import { UserRole } from "../models/user.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
         userId: string,
         role: UserRole
      }
    }
  }
}

export {};