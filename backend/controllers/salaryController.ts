import { Request, Response } from "express";
import Salary from "../model/salaryModel";
import Employee from "../model/employeeModel";

// Admin → Add Salary
const handleAddSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, basicSalary, bonus, deductions, month, status } = req.body;
    const adminId = (req as any)?.user?.id; // ✅ get id from middleware

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized: Admin ID missing" });
      return;
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ success: false, message: "Employee not found" });
      return;
    }

    const netSalary = basicSalary + (bonus || 0) - (deductions || 0);

    const salary = new Salary({
      employee: employee._id,
      admin: adminId, // ✅ link salary to admin
      basicSalary,
      bonus,
      deductions,
      netSalary,
      month,
      status: status || "Unpaid",
    });

    await salary.save();

    res.status(201).json({ success: true, message: "Salary added successfully", salary });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding salary", error: error.message });
  }
};

// Admin → Get all salaries (for this admin only)
const handleGetAllSalaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any)?.user?.id;

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized: Admin ID missing" });
      return;
    }

    const salaries = await Salary.find({ admin: adminId }) // ✅ filter by admin
      .populate("employee", "name empId email phone image department")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, salaries });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching salaries", error: error.message });
  }
};

// Employee → Get own salaries
const handleGetEmployeeSalaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?.id;

    if (!employeeId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const salaries = await Salary.find({ employee: employeeId })
      .populate("employee", "name empId email phone image department")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, salaries });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching salaries", error: error.message });
  }
};

// Admin → Update Salary
const handleUpdateSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { basicSalary, bonus, deductions, status } = req.body;

    const salary = await Salary.findById(id);
    if (!salary) {
      res.status(404).json({ success: false, message: "Salary not found" });
      return;
    }

    salary.basicSalary = basicSalary ?? salary.basicSalary;
    salary.bonus = bonus ?? salary.bonus;
    salary.deductions = deductions ?? salary.deductions;
    salary.netSalary =
      salary.basicSalary + (salary.bonus || 0) - (salary.deductions || 0);
    if (status) salary.status = status;

    await salary.save();

    res.status(200).json({ success: true, message: "Salary updated successfully", salary });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating salary", error: error.message });
  }
};

// Admin → Delete Salary
const handleDeleteSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByIdAndDelete(id);

    if (!salary) {
      res.status(404).json({ success: false, message: "Salary not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Salary deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting salary", error: error.message });
  }
};

export {
  handleAddSalary,
  handleGetAllSalaries,
  handleGetEmployeeSalaries,
  handleUpdateSalary,
  handleDeleteSalary,
};
