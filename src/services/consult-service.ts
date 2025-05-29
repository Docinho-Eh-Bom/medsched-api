import { CreateConsultSchema, UpdateConsultStatusSchema,  } from './../schema/consult-schema';
import { ConsultRepository } from './../repositories/consult-repository';
import { UserRepository } from '../repositories/user-repository';
import { Consult, ConsultStatus } from "../models/consult";
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { hashPassword, comparePassword, generateToken } from '../utils/jwt';
import {z} from "zod";

type CreateConsultData = z.infer<typeof CreateConsultSchema>;
type UpdateConsultStatusData = z.infer<typeof UpdateConsultStatusSchema>;

export class ConsultService{
    private consultRepository: ConsultRepository;
    private userRepository: UserRepository;

    constructor() {
        this.consultRepository = new ConsultRepository();
        this.userRepository = new UserRepository();
    }

    // validate the ownership of the consult
    private async validateConsultOwnership(consultId: string, userId: string, userRole: string): Promise<Consult> {
    const consult = await this.consultRepository.findById(consultId);
    if (!consult) throw new NotFoundError("Consult not found.");

    if (userRole !== 'admin' && consult.patientId !== userId && consult.medicId !== userId) {
    throw new UnauthorizedError("You don't have permission to access this consult.");
    }

    return consult;
}

  //create a new consult
    async create(data: CreateConsultData, patientId: string,medicId: string): Promise<Consult>{
    //if medic exists and is a medic
    const medic = await this.userRepository.findById(data.medicId);
    if (!medic || medic.role !== 'medic') {
    throw new BadRequestError("Invalid medic ID.");
    }

    // same but for patient
    const patient = await this.userRepository.findById(patientId);
    if (!patient || patient.role !== 'patient') {
    throw new BadRequestError("Invalid patient ID.");
    }

    const consult = await this.consultRepository.create({
        ...data,
        patientId,
        status: 'scheduled'
    });

    return consult;
    }

  //get by consult id
    async getById(consultId: string, userId: string, userRole: string): Promise<Consult[]> {
    const consult = await this.validateConsultOwnership(consultId, userId, userRole);
    return [consult];
    }

  //get by patient id
    async getByPatientId(patientId: string, userId: string, userRole: string): Promise<Consult[]> {
    if (userRole !== 'admin' && userId !== patientId) {
        throw new UnauthorizedError("You don't have permission to access this patient's consults.");
    }
    return await this.consultRepository.findByPatientId(patientId);
}

    //get by medic id
    async getByMedicId(medicId: string, userId: string, userRole: string): Promise<Consult[]> {
        if (userRole !== 'admin' && userId !== medicId) {
            throw new UnauthorizedError("You don't have permission to access this medic's consults.");
        }
        return await this.consultRepository.findByMedicId(medicId);
    }

    //update consult status
    async updateStatus(consultId: string, data: UpdateConsultStatusData, userId: string, useRole: string): Promise<Consult[]>{
        const consult = await this.validateConsultOwnership(consultId, userId, useRole);

        //of course only admins|medics can update
        if(useRole !== 'admin' && useRole !== 'medic') {
            throw new UnauthorizedError("You don't have permission to update this consult.");
        }
        //if it was already completed or cancelled it can't be updated
        if(consult.status === 'completed' || consult.status === 'cancelled') {
            throw new ConflictError("Consult is already completed or canceled.");
        }

        const updatedConsult = await this.consultRepository.updateStatus(consultId, data.status);
        if (!updatedConsult) {
            throw new NotFoundError("Consult not found.");
        }

        return [updatedConsult];
    }

    //list consults by the status 
    async listByStatus(status: ConsultStatus, userId: string, userRole: string): Promise<Consult[]> {
        if(userRole !== 'admin') {
            throw new UnauthorizedError("You don't have permission to list consults by status.");
        }
        const consults = await this.consultRepository.listByStatus(status);
        return consults;
    }
    
    //add notes to consult
    async addNotes(consultId: string, notes: string, userId: string, userRole: string): Promise<Consult> {
    const consult = await this.validateConsultOwnership(consultId, userId, userRole);
    
    //medics and admins can add notes
    if (userRole !== 'admin' && userRole !== 'medic') {
        throw new UnauthorizedError("Only medics and admins can add notes to consults.");
    }

    const updatedConsult = await this.consultRepository.addNotes(consultId, notes);
    if (!updatedConsult) {
        throw new NotFoundError("Consult not found.");
    }

    return updatedConsult;
    }

    //delete consult
    async delete(consultId: string, userId: string, userRole: string): Promise<Consult> {
    const consult = await this.validateConsultOwnership(consultId, userId, userRole);
    
    //Only admins can delete consults
    if (userRole !== 'admin') {
    throw new UnauthorizedError("Only admins can delete consults.");
    }

    const deletedConsult = await this.consultRepository.delete(consultId);
    if (!deletedConsult) {
    throw new NotFoundError("Consult not found.");
    }

    return deletedConsult;
    }

}