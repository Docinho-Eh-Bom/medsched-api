export type ConsultStatus = 'scheduled' | 'completed' | 'cancelled';

export type Consult = {
    id: string;
    patientId: string;
    medicId: string;
    date: Date;
    status: ConsultStatus;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;//Opcional para anotações/prescrição /diagnostico
}



