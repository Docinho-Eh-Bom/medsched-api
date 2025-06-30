import { env } from './config/env.js';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { Request, Response, RequestHandler } from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = env.PORT || 3000;


app.use(helmet());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the MedSched API",});
});

app.get('/medics', async (req: Request, res: Response) => {
  const medics = await prisma.medic.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    }
  });

  const flattened = medics.map(m => ({
    userId: m.userId,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    role: m.user.role,
    email: m.user.email,
    speciality: m.speciality,
    crm: m.crm,
  }));

  res.json(flattened);
});



app.get('/patients', async (req: Request, res: Response) => {
  const patients = await prisma.patient.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    }
  });

  const flattened = patients.map(p => ({
    userId: p.userId,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    email: p.user.email,
    role: p.user.role,
    cpf: p.cpf,
    cellphone: p.cellphone,
  }));

  res.json(flattened);
});


app.get('/consults', async (req: Request, res: Response) => {
  const consults = await prisma.consult.findMany({
include: {
      medic: { 
        select: {
          firstName: true,
          lastName: true,
        },
      },
      patient: {  
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

    const flattened = consults.map(c => ({
    id: c.id,
    medicId: c.medicId,
    patientId: c.patientId,
    date: c.date,
    status: c.status,
    medic: {
      firstName: c.medic.firstName,
      lastName: c.medic.lastName,
    },
    patient: {
      firstName: c.patient.firstName,
      lastName: c.patient.lastName,
    },
  }));

  res.json(flattened);
});

const loginHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return; 
  }
  
  res.json({ id: user.id, email: user.email, role: user.role });
};

const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return; 
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        role: role || 'PATIENT'//default is patient
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
     console.error('Register error:', error); 
    res.status(500).json({ error: 'Internal server error' });
  }
};


const createConsultHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { date, medicId, patientId } = req.body;

    if (!date || !medicId || !patientId) {
      res.status(400).json({ error: 'Missing fields (needs: date, medicId, patientId)' });
    }

    const [medic, patient] = await Promise.all([
      prisma.medic.findUnique({ where: { userId: medicId } }),
      prisma.patient.findUnique({ where: { userId: patientId } })
    ]);

    if (!medic) res.status(404).json({ error: 'Medic not found' });
    if (!patient) res.status(404).json({ error: 'Patient not found' });

    const newConsult = await prisma.consult.create({
      data: {
        date: new Date(date),
        medicId,
        patientId,
        status: 'SCHEDULED' //default
      },
      include: {
        medic: { select: { firstName: true, lastName: true } },
        patient: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(newConsult);

  } catch (error) {
    console.error('EError creating consult:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.post('/consults', createConsultHandler);
app.post('/register', registerHandler);
app.post('/login', loginHandler);


app.use(errorHandler);

app.listen(port, () => {
    console.log(`MedSched API running in http://localhost:${port}`);
});