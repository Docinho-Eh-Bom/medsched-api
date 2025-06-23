import { userRoleValidation } from "../schema/users-schema";
import { UserRepository } from "../repositories/user-repository";
import { User, UserRole } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { hashPassword, comparePassword, generateToken  } from "../utils/jwt";
import { z } from "zod";

type CreateUserData = z.infer<typeof userRoleValidation.createUserSchema>;
type UpdateUserData = z.infer<typeof userRoleValidation.updateUserSchema>;

export interface AuthResponse{
    user: Omit<User, 'password'>;
    token: string;
}

export class UserService{
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: CreateUserData)



}



