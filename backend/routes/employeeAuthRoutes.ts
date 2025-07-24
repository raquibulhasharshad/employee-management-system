import express from 'express';
import {
  handleEmployeeLogin,
  handleEmployeeLogout,
  handleEmployeeAuthCheck,
  handleEmployeeChangePassword
} from '../controllers/employeeAuthController';

import restrictToEmployeeOnly from '../middlewares/employeeAuth';

const router = express.Router();

router.post("/login", handleEmployeeLogin);
router.post("/logout", handleEmployeeLogout);
router.get("/check", handleEmployeeAuthCheck);
router.put("/change-password", restrictToEmployeeOnly, handleEmployeeChangePassword);

export default router;
