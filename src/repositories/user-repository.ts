import { PrismaClient } from "@prisma/client";
import { User, MedicData, PatientData } from "../models/user";
import { UserRepositoryInterface } from "./user-repository.interface";
import { NotFoundError } from "../errors/not-found-error";

const prisma = new PrismaClient();

export class UserRepository implements UserRepositoryInterface{

    private static users: User[] = [];
    
    async create(user: Omit<User, 'id'> & { medicData?: MedicData } & {patientData?: PatientData}): Promise<User> {
        let newUser;

        if(user.role === 'admin'){
            newUser = await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
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
                    id: crypto.randomUUID(),
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
                    id: crypto.randomUUID(),
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
        UserRepository.users.push(newUser);
        return newUser as User;
    }

    //find user by id 
    async findById(id: string): Promise<User | null>{
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
    }

    //find user by first name 
    async findByFirstName(firstName: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { firstName },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
    }

    //find user by last name
    async findByLastName(lastName: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { lastName },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
    }

    //find user by email
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { email },
            include: {
                medic: true,
                patient: true
            }
        });
        return user as User | null;
    }

    //find user(patient) by cpf
    async findByCpf(cpf: string): Promise<User | null> {
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
    }

    //find user(medic) by crm
    async findByCrm(crm: string): Promise<User | null> {
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
    }

    
    //find user(medic) by speciality
    async findBySpeciality(speciality: string): Promise<User | null> {
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
    }

    //list by role
    async listByRole(role: 'admin' | 'medic' | 'patient'): Promise<User[]> {
        const users = await prisma.user.findMany({
            where: { role },
            include: {
                medic: true,
                patient: true
            }
        });
        return users as User[];
    }

    //adding available slot for medic
    async addMedicAvailableSlot(medicId: string, date: Date): Promise<MedicData> {
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
    }


    //get available slots for medic
    async getMedicAvailableSlots(medicId: string): Promise<Date[]> {
        const medic = await prisma.medic.findUnique({
            where: { id: medicId },
            select: { availableSlots: true }
        });
        return medic?.availableSlots || [];
    }

    //get patient data
    async getPatientData(patientId: string): Promise<PatientData | null> {
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
    }

    //get medic data
    async getMedicData(medicId: string): Promise<MedicData | null> {
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
    }



}

