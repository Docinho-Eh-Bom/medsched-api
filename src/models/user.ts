export type UserRole = 'admin' | 'medic' | 'patient';

export type BaseUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export type PatientData = {
    cpf: string;
    cellphone: string;
    birthDate: Date;
}


export type MedicData = {
    speciality: string;
    crm: string;
    availableSlots: Date[];
}

export type User = BaseUser & (
    | {role: 'admin'}
    | {role: 'patient'; patientData: PatientData} 
    | {role:  'medic'; medicData: MedicData} 
);