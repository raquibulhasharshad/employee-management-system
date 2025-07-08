import express from 'express';
import {
  getAllEmployees,
  addEmployees,
  updateEmployees,
  deleteEmployees
} from '../controllers/employeeController';

import restrictToLoggedinUserOnly from '../middlewares/auth';
import validateEmployeeData from '../middlewares/validateEmployee';

const employeeRoutes: express.Router = express.Router();

employeeRoutes.get("/employees", restrictToLoggedinUserOnly, getAllEmployees);
employeeRoutes.post("/employees", restrictToLoggedinUserOnly, validateEmployeeData, addEmployees);
employeeRoutes.put("/employees/:id", restrictToLoggedinUserOnly, validateEmployeeData, updateEmployees);
employeeRoutes.delete("/employees/:id", restrictToLoggedinUserOnly, deleteEmployees);

export default employeeRoutes;
