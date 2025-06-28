import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("USER123+", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "Root",
      email: "admin@gmail.com",
      password,
      role: "ADMIN"
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: "patient@gmail.com" },
    update: {},
    create: {
      firstName: "Patient",
      lastName: "Root",
      email: "patient@gmail.com",
      password,
      role: "PATIENT",
      patient: {
        create: {
          cpf: "741.852.963-00",
          cellphone: "51 99999-9999",
          birthDate: new Date("2000-01-01"),
        }
      }
    },
  });

  const medic = await prisma.user.upsert({
    where: { email: "medic@gmail.com" },
    update: {},
    create: {
      firstName: "Medic",
      lastName: "Root",
      email: "medic@gmail.com",
      password,
      role: "MEDIC",
      medic: {
        create: {
          speciality: "Neurologia",
          crm: "123456-RS",
          availableSlots: {}
        }
      }
    },
  });

  console.log("Admin criado com sucesso:", admin);
  console.log("Paciente criado com sucesso:", patient);
  console.log("Médico criado com sucesso:", medic);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());