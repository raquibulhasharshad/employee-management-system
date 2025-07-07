import express from 'express';
import { getAllEmployees, addEmployees, updateEmployees, deleteEmployees  } from '../controllers/employeeController';
import validateEmployeeData from '../middlewares/validateEmployee';
import restrictToLoggedinUserOnly from '../middlewares/auth';

const employeeRoutes: express.Router = express.Router();

employeeRoutes.get("/employees",restrictToLoggedinUserOnly, getAllEmployees);
employeeRoutes.post("/employees",restrictToLoggedinUserOnly,validateEmployeeData, addEmployees);
employeeRoutes.put("/employees/:id",restrictToLoggedinUserOnly,validateEmployeeData, updateEmployees);
employeeRoutes.delete("/employees/:id",restrictToLoggedinUserOnly, deleteEmployees);

export default employeeRoutes;

