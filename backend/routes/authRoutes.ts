import express from 'express';
import {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  handleAuthCheck,
  handleGetAdminDetails,
  handleChangePassword,
  handleUpdateAdmin,
  handleDeleteAccount,
  handleForgotPassword,
  handleResetPassword
} from '../controllers/authController';

import restrictToLoggedinUserOnly from '../middlewares/auth';
import validateSignupFields from '../middlewares/validateSignupFields';

const authRoutes = express.Router();

authRoutes.post("/signup", validateSignupFields, handleUserSignup);
authRoutes.post("/login", handleUserLogin);
authRoutes.post("/logout", handleUserLogout);
authRoutes.get("/check", handleAuthCheck);

// Forgot/Reset password
authRoutes.post("/forgot-password", handleForgotPassword);
authRoutes.post("/reset-password", handleResetPassword);

authRoutes.get("/profile", restrictToLoggedinUserOnly, handleGetAdminDetails);
authRoutes.put("/update-profile", restrictToLoggedinUserOnly, handleUpdateAdmin);
authRoutes.put("/change-password", restrictToLoggedinUserOnly, handleChangePassword);
authRoutes.delete("/delete-account", restrictToLoggedinUserOnly, handleDeleteAccount);

export default authRoutes;
