import {z} from 'zod';

//schema base for user (common fields)
export const baseUserSchema = z.object({
  id: z.string().uuid("User ID must be a valid UUID"),
  firstName: z.string().min(3, "Name is required").max(50, "Name must be less than 50 characters"),
  lastName: z.string().min(4, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must have at least 6 characters")
      .max(20, "Password must have at most 20 characters")
      .regex(
         /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/,
         "Password must contain at least one letter, one number, and one special character."
      ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

//schema for patient user
const patientDataSchema = z.object({
    cpf: z.string().length(11, "CPF must be exactly 11 characters").regex(/^\d{3}-\d{3}-\d{3}-\d{2}$/, "CPF must be exactly 11 digits"),
    cellphone: z.string().length(11, "Cellphone must be exactly 11 characters").regex(/^\d{2}-\d{4}-\d{4}$/, "Cellphone must be in the format XX-XXXX-XXXX"),
    birthDate: z.coerce.date().refine(date => date <= new Date(), "Birth date must be in the past"),

});

//schema for medic user 
const medicDataSchema =z.object({
    speciality: z.string().min(3, "Speciality is required").max(85, "Speciality must be less than 85 characters"),
    crm: z.string().regex(/^\d{6}-\d{2}\/[A-Z]{2}$/, "CRM must be in the format XXXXXX-XX/YY"),
    availableSlots: z.array(z.date()).optional(),
})

export const userRoleValidation = {
  createUserSchema: z.discriminatedUnion("role", [
      baseUserSchema.extend({
        role: z.literal("admin")
    }),
    baseUserSchema.extend({
        role: z.literal("patient"),
        patientData: patientDataSchema
    }),
    baseUserSchema.extend({
      role: z.literal("medic"),
      medicData: medicDataSchema
    })
  ]),

  updateUserSchema: baseUserSchema.partial().extend({
    role: z.enum(["admin", "patient", "medic"]).optional(),
    patientData: patientDataSchema.partial().optional(),
    medicData: medicDataSchema.partial().optional(),
  }),

  addMedicSlot: z.object({
    slot: z.coerce.date()
  })
};