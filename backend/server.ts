import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();

import employeeRoutes from './routes/employeeRoutes';
import authRoutes from './routes/authRoutes';
import employeeAuthRoutes from './routes/employeeAuthRoutes';
import leaveRoutes from './routes/leaveRoutes';
import salaryRoutes from './routes/salaryRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import mailRoutes from './routes/mailRoutes';

const app: express.Application = express();
const hostname = '127.0.0.1';
const port = 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employee/auth', employeeAuthRoutes);
app.use('/api/leave', leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/mail", mailRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/employeedb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
