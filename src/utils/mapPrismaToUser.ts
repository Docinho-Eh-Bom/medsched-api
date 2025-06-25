import {User} from '../models/user';

export function mapPrismaToUser(user: any): User{
    const role = user.role.toLowerCase() as User['role'];

    const base = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password, 
        role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    if(role === 'admin') return base as User;

    if (role === 'medic') return {
        ...base,
        medicData:{
            speciality: user.medic?.speciality,
            crm: user.medic?.crm,
            availableSlots: user.medic?.availableSlots.map((slot: any) => slot.date) || [],
        }
    } as User;

    if (role === 'patient') return {
        ...base,
        patientData: {
            cpf: user.patient?.cpf,
            cellphone: user.patient?.cellphone,
            birthDate: user.patient?.birthDate
        }
    } as User;

    throw new Error(`Invalid user role: ${role}`);
}