import { userRoleValidation } from "../schema/users-schema";
import { UserRepository } from "../repositories/users-repository";
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

    //create new user
    async createUser(data: CreateUserData): Promise<AuthResponse>{
        //check if user already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError("User with this email already exists.");
        }

        //hash password
        const hashedPassword = await hashPassword(data.password);

        //create user
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
            medicData: data.role === "medic" && data.medicData
                ? { ...data.medicData, availableSlots: data.medicData.availableSlots ?? [] }
                : undefined,
            patientData: data.role === "patient" ? data.patientData : undefined
        });

        //generate token
        const token = generateToken(user);
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }

    //user login
    async login(email: string, password: string): Promise<AuthResponse> {
        //find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        //compare password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError("Invalid password.");
        }

        //generate token
        const token = generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }

    //user data update
    async updateUser(userId: string, data: UpdateUserData, requestId: string, requestRole: UserRole): Promise<Omit<User, 'password'>>{
        if(requestId !== userId && requestRole !== 'admin') {
            throw new UnauthorizedError("You don't have permission to update this user.");
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        if(data.email) {
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser && existingUser.id !== userId) {
                throw new ConflictError("User with this email already exists.");
            }
        }

        if(data.password) {
            data.password = await hashPassword(data.password);
        }

        //fields necessary for medic and patient roles verification
        let medicData = undefined;
        if (data.medicData) {
            if (typeof data.medicData.speciality !== "string" || typeof data.medicData.crm !== "string") {
                throw new BadRequestError("Medic speciality and crm are required.");
            }
            medicData = {
                speciality: data.medicData.speciality,
                crm: data.medicData.crm,
                availableSlots: data.medicData.availableSlots ?? []
            };
        }

        let patientData = undefined;
        if (data.patientData) {
            if (typeof data.patientData.cpf !== "string" || typeof data.patientData.cellphone !== "string" || !(data.patientData.birthDate instanceof Date)) {
                throw new BadRequestError("Patient cpf, cellphone, and birthDate are required.");
            }
            patientData = {
                cpf: data.patientData.cpf,
                cellphone: data.patientData.cellphone,
                birthDate: data.patientData.birthDate
            };
        }

        const updateData = {
            ...data,
            medicData,
            patientData
        };

        const updatedUser = await this.userRepository.update(userId, updateData);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    //delete user by id
    async deleteUser(userId: string, requestId: string, requestRole: UserRole): Promise<Omit<User, 'password'>> {
        if (requestId !== userId && requestRole !== 'admin') {
            throw new UnauthorizedError("You don't have permission to delete this user.");
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        const deletedUser = await this.userRepository.delete(userId);
        if (!deletedUser) {
            throw new NotFoundError("User not found.");
        }

        const { password, ...userWithoutPassword } = deletedUser;
        return userWithoutPassword;
    }

    //get user by id
    async getUserById(userId: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    //get user by email
    async getUserByEmail(email: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    //list users by role (of course its for admins only)
    async listByRole(role: UserRole, requesterRole: UserRole): Promise<Omit<User, 'password'>[]> {
        if (requesterRole !== 'admin') {
            throw new UnauthorizedError("You don't have permission to list users by role.");
        }

        const users = await this.userRepository.listByRole(role);
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    //list all users (admins only)
    async listAll(requesterRole: UserRole): Promise<Omit<User, 'password'>[]> {
        if (requesterRole !== 'admin') {
            throw new UnauthorizedError("You don't have permission to list all users.");
        }

        const users = await this.userRepository.listAll();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    








}



