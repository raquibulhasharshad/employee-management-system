import express from "express";
import { 
  handleAddSalary,
  handleGetAllSalaries,
  handleDeleteSalary,
  handleUpdateSalary,
  handleGetEmployeeSalaries 
} from "../controllers/salaryController";

import restrictToLoggedinUserOnly from "../middlewares/auth";
import restrictToEmployeeOnly from "../middlewares/employeeAuth";
import { validateAddSalaryData, validateUpdateSalaryData } from "../middlewares/validateSalaryData";

const salaryRoutes: express.Router = express.Router();

// Admin routes
salaryRoutes.post("/add", restrictToLoggedinUserOnly, validateAddSalaryData, handleAddSalary);
salaryRoutes.get("/all", restrictToLoggedinUserOnly, handleGetAllSalaries);
salaryRoutes.put("/:id", restrictToLoggedinUserOnly, validateUpdateSalaryData, handleUpdateSalary);
salaryRoutes.delete("/:id", restrictToLoggedinUserOnly, handleDeleteSalary);

// Employee route
salaryRoutes.get("/my-salaries", restrictToEmployeeOnly, handleGetEmployeeSalaries);

export default salaryRoutes;
