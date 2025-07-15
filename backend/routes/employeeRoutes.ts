import express from 'express';
import {
  getAllEmployees,
  addEmployees,
  updateEmployees,
  deleteEmployees
} from '../controllers/employeeController';

import restrictToLoggedinUserOnly from '../middlewares/auth';
import validateEmployeeData from '../middlewares/validateEmployee';
import uploads from '../middlewares/upload';

const employeeRoutes: express.Router = express.Router();

employeeRoutes.get("/employees", restrictToLoggedinUserOnly, getAllEmployees);
employeeRoutes.post("/employees", restrictToLoggedinUserOnly,uploads.single('image'), validateEmployeeData, addEmployees);
employeeRoutes.put("/employees/:id", restrictToLoggedinUserOnly,uploads.single('image'), validateEmployeeData, updateEmployees);
employeeRoutes.delete("/employees/:id", restrictToLoggedinUserOnly, deleteEmployees);

export default employeeRoutes;