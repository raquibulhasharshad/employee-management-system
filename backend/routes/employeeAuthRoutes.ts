import express from 'express';
import {
  handleEmployeeLogin,
  handleEmployeeLogout,
  handleEmployeeAuthCheck,
  handleEmployeeChangePassword,
  handleGetEmployeeDetails,
  handleEmployeeForgotPassword,
  handleEmployeeResetPassword
} from '../controllers/employeeAuthController';

import restrictToEmployeeOnly from '../middlewares/employeeAuth';

const router = express.Router();

router.post("/login", handleEmployeeLogin);
router.post("/logout", handleEmployeeLogout);
router.get("/check", handleEmployeeAuthCheck);

// Forgot/Reset password
router.post("/forgot-password", handleEmployeeForgotPassword);
router.post("/reset-password", handleEmployeeResetPassword);

router.put("/change-password", restrictToEmployeeOnly, handleEmployeeChangePassword);
router.get("/profile", restrictToEmployeeOnly, handleGetEmployeeDetails);

export default router;
