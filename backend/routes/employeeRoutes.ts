import express from 'express';
import { getAllEmployees, addEmployees, updateEmployees, deleteEmployees  } from '../controllers/employeeController';
import validateEmployeeData from '../middlewares/validateEmployee';

const employeeRoutes: express.Router = express.Router();

employeeRoutes.get("/employees", getAllEmployees);
employeeRoutes.post("/employees",validateEmployeeData, addEmployees);
employeeRoutes.put("/employees/:id",validateEmployeeData, updateEmployees);
employeeRoutes.delete("/employees/:id", deleteEmployees);

export default employeeRoutes;

