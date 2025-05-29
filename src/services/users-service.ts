import { APIError } from "../errors/api-error";
import { User, UserRole, PatientData, MedicData } from "../models/user";
import { UserRepositoryInterface } from "../repositories/user-repository.interface";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";


