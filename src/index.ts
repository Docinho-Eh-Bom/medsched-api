import express from 'express';
import { Request, Response } from 'express';
import { errorHandler } from './middlewares/error-handler';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the API",});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});