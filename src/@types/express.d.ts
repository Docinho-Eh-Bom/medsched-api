import { UserRole } from "../models/user";

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