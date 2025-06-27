import { env } from './config/env.js';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { setupSwagger } from './swagger/swagger.js';
import { Request, Response } from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { authRoutes } from './routes/auth-routes.js';
import { consultRoutes } from './routes/consult-routes.js';
import { usersRoutes } from './routes/users-routes.js';

//swagger setup

dotenv.config();

const app = express();
const port = env.PORT || 3000;


app.use(helmet());
app.use(express.json());
setupSwagger(app);
app.use("/auth", authRoutes);
app.use("/consults", consultRoutes);
app.use("/users", usersRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the MedSched API",});
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`MedSched API running in http://localhost:${port}`);
});