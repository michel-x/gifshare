import 'dotenv/config';
import express, { json } from 'express';
import cors from "cors";
require('express-async-errors');
import { errorHandler } from './middlewares/error-handler';
import { currentUser } from './middlewares/current-user';
import { NotFoundError } from './errors/not-found-error';
import { filesRouter } from './routes/files';


const app = express();
app.use(json());
app.use(cors());
app.use(currentUser);

app.use('/files', filesRouter);
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };