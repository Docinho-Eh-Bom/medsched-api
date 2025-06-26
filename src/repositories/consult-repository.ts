import { PrismaClient } from "@prisma/client";
import { Consult, ConsultStatus } from "../models/consult";
import { ConsultRepositoryInterface } from "./consult-repository.interface";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";

const prisma = new PrismaClient();

export class ConsultRepository implements ConsultRepositoryInterface{

    async create(consult: Omit<Consult, 'id' | 'createdAt' | 'updatedAt'>):Promise<Consult> {
        const newConsult = await prisma.consult.create({
            data: {
                date: consult.date,
                status: 'SCHEDULED',
                notes: consult.notes,
                patientId: consult.patientId,
                medicId: consult.medicId
            }
        });
;        return newConsult as Consult;
    }

    //find consult by id    
    async findById(id: string): Promise<Consult | null> {
        try{
            const consult = await prisma.consult.findUnique({
            where: { id }
        });
        return consult as Consult | null;
        }catch(error) {
            throw new NotFoundError("Consult not found.");
            return null;
        }
    }

    //find consult by patient id
    async findByPatientId(patientId: string): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            where: { patientId },
            orderBy: { date: 'asc' }
        });
        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults for the specified patient.");
            return [];
        }

    }
    
    //find consult by medic id
    async findByMedicId(medicId: string): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            where: { medicId },
            orderBy: { date: 'asc' }
        });
        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults for the specified medic.");
            return [];
        }
    }

    //update consult by consult id, omitting certain fields
    //because medics can alter it, if it was only admins i wouldn't omit
    async update(id: string, consult: Partial<Omit<Consult, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Consult | null> {
        try{
            const updatedConsult = await prisma.consult.update({
            where: { id },
            data: {
                ...consult,
                updatedAt: new Date() 
            }
        });
        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not update consult. Please check the provided data.");
            return null;
        }
    }

    //update consult status
    async updateStatus(id: string, status: ConsultStatus): Promise<Consult | null> {
        try{
            const updatedConsult = await prisma.consult.update({
            where: { id },
            data: { 
                status,
                updatedAt: new Date()
            }
        });
        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not update consult status. Please check the provided data.");
            return null;
        }
    }

    //list all consults
    async listAll(): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            orderBy: { date: 'asc' }
        });
        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults.");
            return [];
        }
    }
    
    //list consults by status
    async listByStatus(status: ConsultStatus): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            where: { status },
            orderBy: { date: 'asc' }
        });
        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults for the specified status.");
            return [];
        }
    }

    //add notes to a consult
    async addNotes(id: string, notes: string): Promise<Consult | null> {
        try{
            const updatedConsult = await prisma.consult.update({
            where: { id },
            data: { 
                notes,
                updatedAt: new Date() 
            }
        });
        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not add notes to consult. Please check the provided data.");
            return null;
        }
    }

    //delete a consult 
    async delete(id: string): Promise<Consult | null> {
        try{
            const deletedConsult = await prisma.consult.delete({
            where: { id }
        });
        return deletedConsult as Consult | null;
        }catch(error) {
            throw new NotFoundError("Could not delete consult. Consult not found.");
            return null;
        }
    }

}