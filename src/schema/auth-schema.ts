import { z } from 'zod';
import { baseUserSchema } from './users-schema';
import { userRoleValidation } from './users-schema';

//recycling baseSchema and userRoleValidation schemas for the auth 
export const loginSchema = baseUserSchema.pick({
    email: true,
    password: true,
});

export const registerSchema = userRoleValidation.createUserSchema