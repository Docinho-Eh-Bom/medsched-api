import { PrismaClient } from "@prisma/client";
import { User, MedicData, PatientData } from "../models/user";
import { UserRepositoryInterface } from "./user-repository.interface";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";

const prisma = new PrismaClient();

export class UserRepository implements UserRepositoryInterface{    
    async create(user: Omit<User, 'id'> & { medicData?: MedicData } & {patientData?: PatientData}): Promise<User> {
        let newUser;

        if(user.role === 'admin'){
            newUser = await prisma.user.create({
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    role: user.role
                }
            });
        }else if(user.role === 'medic'){
            if (!user.medicData) {
                throw new NotFoundError("Medic data is required for users with role 'medic'");
            }
            newUser = await prisma.user.create({
                data:{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    medic: {
                        create: {
                            speciality: user.medicData.speciality,
                            crm: user.medicData.crm,
                        }
                    }
                }, include: { medic: true}
            });
        }else if(user.role === 'patient'){
            if(!user.patientData) {
                throw new NotFoundError("Patient data is required for users with role 'patient'");
            }
            newUser = await prisma.user.create({
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    patient: {
                        create: {
                            cpf: user.patientData.cpf,
                            cellphone: user.patientData.cellphone,
                            birthDate: user.patientData.birthDate
                        }
                    }
                }, include: { patient: true }
            });
        }
        return newUser as User;
    }

    //update user
    async update(userId: string, data: Partial<Omit<User, 'id'>> & { medicData?: MedicData } & { patientData?: PatientData }): Promise<User> {
        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    medic: data.medicData ? {
                        update: {
                            speciality: data.medicData.speciality,
                            crm: data.medicData.crm
                        }
                    } : undefined,
                    patient: data.patientData ? {
                        update: {
                            cpf: data.patientData.cpf,
                            cellphone: data.patientData.cellphone,
                            birthDate: data.patientData.birthDate
                        }
                    } : undefined
                },
                include: {
                    medic: true,
                    patient: true
                }
            });
            return user as User;
        } catch (error) {
            throw new BadRequestError("Could not update user.");
        }
    }

    //delete user by id
    async delete(userId: string): Promise<User | null> {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id: userId },
                include: {
                    medic: true,
                    patient: true
                }
            });
            return deletedUser as User;
        } catch (error) {
            throw new NotFoundError("User not found.");
        }
    }
    
    //find user by id 
    async findById(id: string): Promise<User | null>{
        try{
            const user = await prisma.user.findUnique({
            where: { id },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("User not found.");
            return null;
        }
    }

    //find user by first name 
    async findByFirstName(firstName: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
            where: { firstName },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
        }catch(error){  
            throw new NotFoundError("User not found.");
            return null;
        }
    }

    //find user by last name
    async findByLastName(lastName: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
            where: { lastName },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("User not found.");
            return null;
        }
    }

    //find user by email
    async findByEmail(email: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
            where: { email },
            include: {
                medic: true,
                patient: true
                }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("User not found.");
            return null;
        }
    }

    //find user(patient) by cpf
    async findByCpf(cpf: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
                where: {
                    patient: {
                        cpf
                    }
                },
                include: {
                    patient: true
                }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("Patient not found.");
            return null;
        }
    }

    //find user(medic) by crm
    async findByCrm(crm: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
                where: {
                    medic: {
                        crm
                    }
                },
                include: {
                    medic: true
                }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("Medic not found.");
            return null;
        }
    }

    
    //find user(medic) by speciality
    async findBySpeciality(speciality: string): Promise<User | null> {
        try{
        const user = await prisma.user.findFirst({
            where: {
                medic: {
                    speciality
                }
            },
            include: {
                medic: true
            }
        });
        return user as User | null;
        }catch(error){
            throw new NotFoundError("Medic not found.");
            return null;
        }
    }

    //list by role
    async listByRole(role: 'admin' | 'medic' | 'patient'): Promise<User[]> {
        try{
        const users = await prisma.user.findMany({
            where: { role },
            include: {
                medic: true,
                patient: true
            }
        });
        return users as User[];
        }catch(error){
            throw new NotFoundError("No users found for the specified role.");
            return [];
        }
    }

    //adding available slot for medic
    async addMedicAvailableSlot(medicId: string, date: Date): Promise<MedicData> {
        try{
        const medic = await prisma.medic.update({
            where: { id: medicId },
            data: {
                availableSlots: {
                    push: date
                }
            },
            include: { availableSlots: true }
        });
        return medic as MedicData;
        }catch(error) {
            throw new BadRequestError("Could not add available slot for the medic.");
        }
    }


    //get available slots for medic
    async getMedicAvailableSlots(medicId: string): Promise<Date[]> {
        try{
            const medic = await prisma.medic.findUnique({
                where: { id: medicId },
                select: { availableSlots: true }
        });
        return medic?.availableSlots || [];
        }catch(error){
            throw new NotFoundError("Medic not found or has no available slots.");
            return [];
        }
    }

    //get patient data
    async getPatientData(patientId: string): Promise<PatientData | null> {
        try{
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                user: true
            }
        });
        return {
            ...patient,
            role: 'patient',
            patientData:{
                cpf: patient.cpf,
                cellphone: patient.cellphone || '',
                birthDate: patient.birthDate
            }
        };
        }catch(error){
            throw new NotFoundError("Patient not found.");
            return null;
        }
    }

    //get medic data
    async getMedicData(medicId: string): Promise<MedicData | null> {
        try{
            const medic = await prisma.medic.findUnique({
            where: { id: medicId },
            include: {
                user: true
            }
        });
        return {
            ...medic,
            role: 'medic',
            patientData:{
                speciality: medic.speciality,
                crm: medic.crm,
                availableSlots: medic.availableSlots || []
            }
        };
        }catch(error){
            throw new NotFoundError("Medic not found.");
            return null;
        }
    }



}

