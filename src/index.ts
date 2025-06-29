import { env } from './config/env.js';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { Request, Response } from 'express';
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
          email: true
        }
      }
    }
  });

  const flattened = medics.map(m => ({
    userId: m.userId,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    email: m.user.email
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
          email: true
        }
      }
    }
  });

  const flattened = patients.map(p => ({
    userId: p.userId,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    email: p.user.email
  }));

  res.json(flattened);
});


app.get('/consults', async (req: Request, res: Response) => {
  const consults = await prisma.consult.findMany({
    select: {
      id: true,
      date: true,
      medicId: true,
      patientId: true,
      status: true,
    }
  });
  res.json(consults);
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`MedSched API running in http://localhost:${port}`);
});