import { UserRole, User, MedicData, PatientData} from "../models/user";

export interface UserRepositoryInterface{
    create(user: Omit<User, 'id'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByFirstName(firstName: string): Promise<User | null>;
    findByLastName(lastName: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByCpf(cpf: string): Promise<User | null>;
    findByCrm(crm: string): Promise<User | null>;
    findBySpeciality(speciality: string): Promise<User | null>;
    listByRole(role: UserRole): Promise<User[]>;
    addMedicAvailableSlot(medicId: string, slot: Date): Promise<MedicData>;
    getMedicAvailableSlots(medicId: string): Promise<Date[]>;
    getPatientData(patientId: string): Promise<PatientData | null>;
    getMedicData(medicId: string): Promise<MedicData | null>;
}
