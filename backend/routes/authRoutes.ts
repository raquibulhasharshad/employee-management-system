import express from 'express';
import { handleUserSignup, handleUserLogin } from '../controllers/authController';

const authRoutes: express.Router = express.Router();

authRoutes.post("/signup", handleUserSignup);
authRoutes.post("/login", handleUserLogin);

export default authRoutes;
