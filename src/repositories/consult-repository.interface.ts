import { Consult, ConsultStatus } from "../models/consult";

export interface ConsultRepositoryInterface {
    create(consult: Omit<Consult, 'id' | 'createdAt' | 'updatedAt'>): Promise<Consult>;
    findById(id: string): Promise<Consult | null>;
    findByPatientId(patientId: string): Promise<Consult[]>;
    findByMedicId(medicId: string): Promise<Consult[]>;
    update(id: string, consult: Partial<Consult>): Promise<Consult | null>;
    updateStatus(id: string, status: ConsultStatus): Promise<Consult | null>;
    listAll(): Promise<Consult[]>;
    listByStatus(status: ConsultStatus): Promise<Consult[]>;
    addNotes(id: string, notes: string): Promise<Consult | null>;
    delete(id: string): Promise<Consult | null>;
}