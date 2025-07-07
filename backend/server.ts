import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';

const app: express.Application = express();
const hostname = '127.0.0.1';
const port = 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', employeeRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/employeedb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(port, hostname, () => {
    console.log(`Express Server started at http://${hostname}:${port}`);
});
