import express from 'express';
import {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  handleAuthCheck
} from '../controllers/authController';

const authRoutes: express.Router = express.Router();

authRoutes.post("/signup", handleUserSignup);
authRoutes.post("/login", handleUserLogin);
authRoutes.post("/logout", handleUserLogout);
authRoutes.get("/check", handleAuthCheck); // NEW route

export default authRoutes;
