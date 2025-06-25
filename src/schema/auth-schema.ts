import { z } from 'zod';
import { baseUserSchema } from './users-schema';
import { medicDataSchema, patientDataSchema } from './users-schema';

//recycling baseSchema schemas for the auth 
export const loginSchema = baseUserSchema.pick({
    email: true,
    password: true,
});

export const registerSchema = z.object({
    firstName: z.string().min(3, "Name is required").max(50, "Name must be less than 50 characters"),
    lastName: z.string().min(4, "Last name is required").max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must have at least 6 characters")
        .max(20, "Password must have at most 20 characters")
        .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/,
        "Password must contain at least one letter, one number, and one special character."
    ),
    role: z.enum(["admin", "patient", "medic"]).optional(),
    medicData: medicDataSchema.optional(),
    patientData: patientDataSchema.optional(),
})