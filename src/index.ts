import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { setupSwagger } from './swagger/swagger';
import { Request, Response } from 'express';
import { errorHandler } from './middlewares/error-handler';
import { authRoutes } from './routes/auth-routes';
import { consultRoutes } from './routes/consult-routes';
import { usersRoutes } from './routes/users-routes';

//swagger setup

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(helmet());
app.use(express.json());
app.use(errorHandler);
setupSwagger(app);
app.use("/auth", authRoutes);
app.use("/consults", consultRoutes);
app.use("/users", usersRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the API",});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});