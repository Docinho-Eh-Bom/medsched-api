import { PrismaClient, UserRole } from "@prisma/client";
import { User, MedicData, PatientData } from "../models/user";
import { UserRepositoryInterface } from "./users-repository.interface";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";
import { mapPrismaToUser } from "../utils/mapPrismaToUser";

const prisma = new PrismaClient();

export class UserRepository implements UserRepositoryInterface{    
    async create(userData: Omit<User, 'id'> & { medicData?: MedicData } & {patientData?: PatientData}): Promise<User> {
        let newUser;

        //admin
        if(userData.role === 'admin'){
            newUser = await prisma.user.create({
                data: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    role: 'ADMIN',
                }
            });
        }

        //medic
        if(userData.role === 'medic'){
            if (!userData.medicData) {
                throw new NotFoundError("Medic data is required for users with role 'medic'");
            }
            newUser = await prisma.user.create({
                data:{
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    role: 'MEDIC',
                    medic: {
                        create: {
                            speciality: userData.medicData.speciality,
                            crm: userData.medicData.crm,
                        }
                    }
                }, include: { medic: {include: { availableSlots: true } } }
            });
        }
        if(userData.role === 'patient'){
            if(!userData.patientData) {
                throw new NotFoundError("Patient data is required for users with role 'patient'");
            }
            newUser = await prisma.user.create({
                data: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    role: 'PATIENT',
                    patient: {
                        create: {
                            cpf: userData.patientData.cpf,
                            cellphone: userData.patientData.cellphone,
                            birthDate: userData.patientData.birthDate
                        }
                    }
                }, include: { patient: true }
            });
        }

        if (!newUser) {
            throw new BadRequestError("User could not be created.");
        }
        return mapPrismaToUser(newUser);
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
                    medic: { include: { availableSlots: true } },
                    patient: true
                }
            });
            if (!user) {
                throw new NotFoundError("User not found.");
            }
            return mapPrismaToUser(user);
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
                    medic: { include: { availableSlots: true } },
                    patient: true
                }
            });
            return mapPrismaToUser(deletedUser);
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
                medic: { include: { availableSlots: true } },
                patient: true
            }
        });

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){
            throw new NotFoundError("User not found.");
        }
    }

    //find user by first name 
    async findByFirstName(firstName: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
            where: { firstName },
            include: {
                medic: { include: { availableSlots: true } },
                patient: true
            }
        });

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){  
            throw new NotFoundError("User not found.");
        }
    }

    //find user by last name
    async findByLastName(lastName: string): Promise<User | null> {
        try{
            const user = await prisma.user.findFirst({
            where: { lastName },
            include: {
                medic: { include: { availableSlots: true } },
                patient: true
            }
        });

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){
            throw new NotFoundError("User not found.");
        }
    }

    //find user by email
    async findByEmail(email: string): Promise<User | null> {
            const user = await prisma.user.findUnique({
            where: { email },
            include: {
                medic: {include: { availableSlots: true } },
                patient: true
                }
        })

        if(!user){
            return null;
        }

        return mapPrismaToUser(user);
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

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){
            throw new NotFoundError("Patient not found.");
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
                    medic: { include: { availableSlots: true } }
                }
        });

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){
            throw new NotFoundError("Medic not found.");
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
                medic: { include: { availableSlots: true } }
            }
        });

        if(!user) throw new NotFoundError("User not found.");

        return mapPrismaToUser(user)
        }catch(error){
            throw new NotFoundError("Medic not found.");
        }
    }

    //list by role
    async listByRole(role: 'admin' | 'medic' | 'patient'): Promise<User[]> {
        try{
        const users = await prisma.user.findMany({
            where: { role: role.toUpperCase() as UserRole },
            include: {
                medic: { include: { availableSlots: true } },
                patient: true
            }
        });
        return users.map(mapPrismaToUser);
        }catch(error){
            throw new NotFoundError("No users found for the specified role.");
        }
    }

    //lis all users
    async listAll(): Promise<User[]> {
        try{
        const users = await prisma.user.findMany({
            include: {
                medic: { include: { availableSlots: true } },
                patient: true
            }
        });
        return users.map(mapPrismaToUser);
        }catch(error){
            throw new NotFoundError("No users found.");
        }
    }

    //adding available slot for medic
    async addMedicAvailableSlot(medicId: string, date: Date): Promise<MedicData> {
        try{
            await prisma.availableSlot.create({
                data: {
                    date,
                    medicId
                }
            })

        const medic = await prisma.medic.findUnique({
            where: { id: medicId },
            include: { availableSlots: true }
        });

        if(!medic) throw new NotFoundError("Medic not found.");

        return {
            speciality: medic.speciality,
            crm: medic.crm,
            availableSlots: medic.availableSlots.map(s => s.date)
        }

        }catch(error) {
            throw new BadRequestError("Could not add available slot for the medic.");
        }
    }


    //get available slots for medic
    async getMedicAvailableSlots(medicId: string): Promise<Date[]> {
        try{
            const slots = await prisma.availableSlot.findMany({
                where: { medicId },
                select: { date: true }
        });
        return slots.map(s => s.date);
        }catch(error){
            throw new NotFoundError("Medic not found or has no available slots.");
        }
    }

    //get patient data
    async getPatientData(patientId: string): Promise<PatientData | null> {
        try{
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        });

        if(!patient) return null;
        
        return {
                cpf: patient.cpf,
                cellphone: patient.cellphone || '',
                birthDate: patient.birthDate
            }
        }catch(error){
            throw new NotFoundError("Patient not found.");
        }
    }

    //get medic data
    async getMedicData(medicId: string): Promise<MedicData | null> {
        try{
            const medic = await prisma.medic.findUnique({
            where: { id: medicId },
            include: { availableSlots: true }
        });

        if(!medic) return null;
        return {
                speciality: medic.speciality,
                crm: medic.crm,
                availableSlots: medic.availableSlots.map(s => s.date)
            }
        }catch(error){
            throw new NotFoundError("Medic not found.");
            return null;
        }
    }

}

