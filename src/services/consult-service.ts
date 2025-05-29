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
type UpdateConsulStatusData = z.infer<typeof UpdateConsultStatusSchema>;

//consult with relations to patient and medic
type ConsultWithRelations = Consult & {
  patient: { id: string, firstName: string, lastName: string };
  medic: { id: string, firstName: string, lastName: string };
};


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
}