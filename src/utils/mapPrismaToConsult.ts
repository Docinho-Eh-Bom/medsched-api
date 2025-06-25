import { Consult } from "../models/consult";
import { Consult as PrismaConsult } from "@prisma/client";

export function mapPrismaToConsult(prismaConsult: PrismaConsult): Consult {
    return {
        id: prismaConsult.id,
        patientId: prismaConsult.patientId,
        medicId: prismaConsult.medicId,
        date: prismaConsult.date,
        status: prismaConsult.status.toLocaleLowerCase() as Consult['status'],
        createdAt: prismaConsult.createdAt,
        updatedAt: prismaConsult.updatedAt,
        notes: prismaConsult.notes || undefined // Optional field
    };
}