import express from 'express';
import { handleUserSignup, handleUserLogin, handleUserLogout } from '../controllers/authController';

const authRoutes: express.Router = express.Router();

authRoutes.post("/signup", handleUserSignup);
authRoutes.post("/login", handleUserLogin);
authRoutes.post("/logout", handleUserLogout); 

export default authRoutes;
