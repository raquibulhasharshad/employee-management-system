import express from 'express'
import {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus
} from '../controllers/leaveController';

import restrictToLoggedinUserOnly from '../middlewares/auth';
import restrictToAdminOnly from '../middlewares/restrictToAdminOnly';
import restrictToEmployeeOnly from '../middlewares/employeeAuth';

const leaveRoutes = express.Router();

leaveRoutes.post('/apply', restrictToEmployeeOnly, applyLeave);
leaveRoutes.get('/my', restrictToEmployeeOnly, getMyLeaves);

leaveRoutes.get('/all', restrictToLoggedinUserOnly,  getAllLeaves);
leaveRoutes.patch('/:id/status', restrictToLoggedinUserOnly, updateLeaveStatus);

export default leaveRoutes;



