import { userRoleValidation } from "../schema/users-schema.js";
import { UserRepository } from "../repositories/users-repository.js";
import { MedicData, PatientData, User, UserRole } from "../models/user.js";
import { BadRequestError } from "../errors/bad-request-error.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ConflictError } from "../errors/conflict-error.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { hashPassword, comparePassword, generateToken  } from "../utils/jwt.js";
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
    async updateUser(userId: string, data: UpdateUserData, requestUserId: string, requestRole: UserRole): Promise<Omit<User, 'password'>>{
                console.log(
            data, data.patientData, requestUserId, requestRole, userId, data.email, data.password
        );
        if(requestUserId !== userId && requestRole !== 'admin') {
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

        let medicData = undefined;
        let patientData = undefined;

        //flexible fields for medic and patient roles verification and update
        if(user.role === 'medic'){
            let medicData = user.medicData;
            if (data.medicData) {
                if ((typeof data.medicData.speciality !== "string" && data.medicData.speciality !== undefined)
                    || (typeof data.medicData.crm !== "string" && data.medicData.crm !== undefined)) {
                    throw new BadRequestError("Medic speciality and crm must be strings if provided.");
                }
                medicData = {
                    ...user.medicData,
                    ...data.medicData,
                    availableSlots: data.medicData?.availableSlots ?? user.medicData?.availableSlots ?? []
                }
            }
        }

        if(user.role === 'patient'){
            let patientData = user.patientData;
            if (data.patientData) {
                if ((typeof data.patientData.cpf !== "string" && data.patientData.cpf !== undefined) 
                    || (typeof data.patientData.cellphone !== "string" && data.patientData.cellphone !== undefined)) {
                    throw new BadRequestError("Patient cpf, cellphone, and birthDate must be valid if provided.");
                }
                patientData = {
                    ...user.patientData,
                    ...data.patientData
                };
            }
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
    async deleteUser(userId: string, requestUserId: string, requestRole: UserRole): Promise<Omit<User, 'password'>> {
        if (requestUserId !== userId && requestRole !== 'admin') {
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

    //get user by first name
    async getUserByFirstName(firstName: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findByFirstName(firstName);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    //get user by last name
    async getUserByLastName(lastName: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findByLastName(lastName);
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

    //get user by cpf(patient only)
    async getUserByCpf(cpf: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findByCpf(cpf);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    //get user by crm(medic only)
    async getUserByCrm(crm: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findByCrm(crm);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    //get user by speciality(medic only)
    async getUserBySpeciality(speciality: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findBySpeciality(speciality);
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

    //add available slot for medic
    async addMedicAvailableSlot(medicId: string, slot: Date): Promise<MedicData> {
        const medic = await this.userRepository.findById(medicId);
        if (!medic || medic.role !== 'medic') {
            throw new NotFoundError("Medic not found.");
        }

        const slotDate = new Date(slot);

        if (isNaN(slotDate.getTime())) {
            throw new BadRequestError("Invalid date format for available slot.");
        }

        const updatedMedic = await this.userRepository.addMedicAvailableSlot(medicId, slotDate);
        return {
        ...updatedMedic,
        availableSlots: updatedMedic.availableSlots ?? [],
        }; 
    }


    //get medic available slots
    async getMedicAvailableSlots(medicId: string): Promise<Date[]> {
        const medic = await this.userRepository.findById(medicId);
        if (!medic || medic.role !== 'medic') {
            throw new NotFoundError("Medic not found.");
        }

        const availableSlots = await this.userRepository.getMedicAvailableSlots(medicId);
        return availableSlots;
    }

    
    //get patient data
    async getPatientData(patientId: string): Promise<PatientData | null> {
        const patient = await this.userRepository.getPatientData(patientId);
        if (!patient) {
            throw new NotFoundError("Patient not found.");
        }
        return patient;
    }


    //get medic data 
    async getMedicData(medicId: string): Promise<MedicData | null> {
        const medic = await this.userRepository.getMedicData(medicId);
        if (!medic) {
            throw new NotFoundError("Medic not found.");
        }
        return medic;
    }

}



