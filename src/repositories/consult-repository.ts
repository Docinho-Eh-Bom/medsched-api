import { PrismaClient } from "@prisma/client";
import { Consult, ConsultStatus } from "../models/consult.js";
import { ConsultRepositoryInterface } from "./consult-repository.interface.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { BadRequestError } from "../errors/bad-request-error.js";

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
        const consult = await prisma.consult.findUnique({
        where: { id }
        });
        if(!consult)  throw new NotFoundError("Consult not found.");
        return consult as Consult | null;
    }

    //find consult by patient id
    async findByPatientId(patientId: string): Promise<Consult[]> {
        const consults = await prisma.consult.findMany({
        where: { patientId },
        orderBy: { date: 'asc' }
        });
        if(!consults || consults.length === 0) throw new NotFoundError("No consults found for the specified patient.");
        return consults as Consult[];
    }
    
    //find consult by medic id
    async findByMedicId(medicId: string): Promise<Consult[]> {
        const consults = await prisma.consult.findMany({
        where: { medicId },
        orderBy: { date: 'asc' }
        });
        if(!consults || consults.length === 0) throw new NotFoundError("No consults found for the specified medic.");
        return consults as Consult[];
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

        if(!updatedConsult) throw new NotFoundError("Consult not found.");

        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not update consult. Please check the provided data.");
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

        if(!updatedConsult) throw new NotFoundError("Consult not found.");

        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not update consult status. Please check the provided data.");
        }
    }

    //list all consults
    async listAll(): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            orderBy: { date: 'asc' }
        });

        if(!consults || consults.length === 0) throw new NotFoundError("No consults found.");

        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults.");
        }
    }
    
    //list consults by status
    async listByStatus(status: ConsultStatus): Promise<Consult[]> {
        try{
            const consults = await prisma.consult.findMany({
            where: { status },
            orderBy: { date: 'asc' }
        });

        if(!consults || consults.length === 0) throw new NotFoundError(`No consults found with status ${status}.`);

        return consults as Consult[];
        }catch(error) {
            throw new NotFoundError("Could not retrieve consults for the specified status.");
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

        if(!updatedConsult) throw new NotFoundError("Consult not found.");

        return updatedConsult as Consult | null;
        }catch(error) {
            throw new BadRequestError("Could not add notes to consult. Please check the provided data.");
        }
    }

    //delete a consult 
    async delete(id: string): Promise<Consult | null> {
        try{
            const deletedConsult = await prisma.consult.delete({
            where: { id }
        });

        if(!deletedConsult) throw new NotFoundError("Consult not found.");

        return deletedConsult as Consult | null;
        }catch(error) {
            throw new NotFoundError("Could not delete consult. Consult not found.");
        }
    }

}