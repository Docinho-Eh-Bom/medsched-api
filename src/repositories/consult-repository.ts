import { PrismaClient } from "@prisma/client";
import { Consult, ConsultStatus } from "../models/consult";
import { ConsultRepositoryInterface } from "./consult-repository.interface";

const prisma = new PrismaClient();

export class ConsultRepository implements ConsultRepositoryInterface{

    private static consults: Consult[] = [];

    async create(consult: Omit<Consult, 'id' | 'createdAt' | 'updatedAt'>):Promise<Consult> {
        const newConsult = await prisma.consult.create({
            data: {
                id: crypto.randomUUID(), // Generate a unique ID for the consult
                date: consult.date,
                status: consult.status,
                notes: consult.notes,
                patientId: consult.patientId,
                medicId: consult.medicId
            }
        });
        ConsultRepository.consults.push(newConsult)
;        return newConsult as Consult;
    }

    //find consult by id    
     async findById(id: String): Promise<Consult | null> {
        const consult = await prisma.consult.findUnique({
            where: { id }
        });
        return consult as Consult | null;
    }

    //find consult by patient id
    async findByPatientId(patientId: string): Promise<Consult[]> {
        const consults = await prisma.consult.findMany({
            where: { patientId }
        });
        return consults as Consult[];
    }
    
    //find consult by medic id
    async findByMedicId(medicId: string): Promise<Consult[]> {
        const consults = await prisma.consult.findMany({
            where: { medicId }
        });
        return consults as Consult[];
    }

    //update consult by consult id, omitting certain fields
    //because medics can alter it, if it was only admins i wouldn't omit
    async update(id: string, consult: Partial<Omit<Consult, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Consult | null> {
        const updatedConsult = await prisma.consult.update({
            where: { id },
            data: consult
        });
        return updatedConsult as Consult | null;
    }

    //update consult status
    async updateStatus(id: string, status: ConsultStatus): Promise<Consult | null> {
        const updatedConsult = await prisma.consult.update({
            where: { id },
            data: { status }
        });
        return updatedConsult as Consult | null;
    }

    //list consults by status
    async listByStatus(status: ConsultStatus): Promise<Consult[]> {
        const consults = await prisma.consult.findMany({
            where: { status }
        });
        return consults as Consult[];
    }

    //add notes to a consult
    async addNotes(id: string, notes: string): Promise<Consult | null> {
        const updatedConsult = await prisma.consult.update({
            where: { id },
            data: { notes }
        });
        return updatedConsult as Consult | null;
    }

    //delete a consult 
    async delete(id: string): Promise<Consult | null> {
        const deletedConsult = await prisma.consult.delete({
            where: { id }
        });
        return deletedConsult as Consult | null;
    }

}