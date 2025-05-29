import { z } from 'zod';

export const ConsultStatusSchema = z.enum(['scheduled', 'completed', 'cancelled']);

export const ConsultSchema = z.object({
    id: z.string().uuid("Consult IS must be a valid UUID"),
    patientId: z.string().uuid("Patient ID must be a valid UUID"),
    medicId: z.string().uuid("Medic ID must be a valid UUID."),
    date: z.date().min(new Date(), "Consult date cannot be in the past"),
    status: ConsultStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

//schema for validation for input
export const CreateConsultSchema = ConsultSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true }).extend({
        date: z.string().datetime().transform((val) => new Date(val)),
        notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
    });

export const UpdateConsultStatusSchema = z.object({
    status: ConsultStatusSchema,
});
