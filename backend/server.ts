import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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

// ✅ Handle port and hostname types
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const hostname: string = process.env.HOSTNAME || '0.0.0.0';

// ✅ CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Change this to your frontend domain when deployed
  credentials: true
}));

// Prevent caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employee/auth', employeeAuthRoutes);
app.use('/api/leave', leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/mail", mailRoutes);

// ✅ MongoDB Atlas connection
const atlasUri: string = process.env.MONGO_URI || 
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1p2hyyf.mongodb.net/employeedb?retryWrites=true&w=majority`;

mongoose.connect(atlasUri)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Start server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
