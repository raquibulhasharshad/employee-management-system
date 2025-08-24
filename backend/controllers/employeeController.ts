import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import Employee from "../model/employeeModel";
import Salary from "../model/salaryModel";
import Leave from "../model/leaveModel";
import User from "../model/userModel";

// GET all employees
const getAllEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const employees = await Employee.find({ createdBy: userId });

    const formatted = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      empId: emp.empId,
      email: emp.email,
      phone: emp.phone,
      address: emp.address,
      image: emp.image,
      department: emp.department,
      position: emp.position,
      gender: emp.gender,
      skills: emp.skills,
      dob: emp.dob,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ADD employee
const addEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const {
      name,
      empId,
      email,
      phone,
      address,
      department,
      position,
      gender,
      skills,
      dob
    } = req.body;

    const existingEmail= await Employee.findOne({email});
    if(existingEmail){
      if(existingEmail.createdBy.toString()===userId){
        res.status(400).json({message:"Employee Email ID already exists for this company"})
      }else{
        res.status(400).json({message:"Employee Email ID already exists for another company"})
      }
      return;
    }

    const existingEmpId= await Employee.findOne({empId, createdBy:userId})
    if(existingEmpId){
      res.status(400).json({message:"Employee Id already exists for this admin"})
      return;
    }



    // Get admin name for password logic
    const admin = await User.findById(userId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    const adminNameFormatted = admin.adminName.replace(/\s+/g, "").toLowerCase();
    const rawPassword = `${adminNameFormatted}${phone}${empId}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newEmployee = new Employee({
      name,
      empId,
      email,
      phone,
      address,
      department,
      position,
      gender,
      skills,
      dob,
      image: imagePath,
      createdBy: userId,
      password: hashedPassword,
    });

    await newEmployee.save();

    res.status(201).json({
      id: newEmployee._id,
      name: newEmployee.name,
      empId: newEmployee.empId,
      email: newEmployee.email,
      phone: newEmployee.phone,
      address: newEmployee.address,
      department: newEmployee.department,
      position: newEmployee.position,
      gender: newEmployee.gender,
      skills: newEmployee.skills,
      dob: newEmployee.dob,
      image: newEmployee.image
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add employee", error });
  }
};

// UPDATE employee
const updateEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const existingEmployee = await Employee.findOne({ _id: id, createdBy: userId });
    if (!existingEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    const {email, empId}=req.body
    if(email){
      const emailConflict= await Employee.findOne({email});
      if(emailConflict && emailConflict._id.toString()!==id){
        if(emailConflict.createdBy.toString()===userId){
          res.status(400).json({message:"Employee email Id already exists for this company"});
        }else{
          res.status(400).json({message:"Employee email Id already exists for another company"});
        }
        return;
      }
    }


    if (empId) {
      const empIdConflict = await Employee.findOne({ empId, createdBy: userId });
      if (empIdConflict && empIdConflict._id.toString() !== id) {
        res.status(400).json({ message: "Employee ID already exists for this company" });
        return;
      }
    }



    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;
      const oldImagePath = path.join(__dirname, `../../${existingEmployee.image}`);

      if (existingEmployee.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      req.body.image = newImagePath;
    }

    if (req.body.removeImage === 'true' && existingEmployee.image) {
      const oldImagePath = path.join(__dirname, `../../${existingEmployee.image}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      req.body.image = '';
    }

    const updated = await Employee.findOneAndUpdate(
      { _id: id, createdBy: userId },
      req.body,
      { new: true }
    );

    res.status(200).json({
      id: updated?._id,
      ...updated?.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update employee", error });
  }
};

// DELETE employee
const deleteEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const employee = await Employee.findOne({ _id: id, createdBy: userId });
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Delete associated salaries
    await Salary.deleteMany({ employee: employee._id });

    // Delete associated leaves
    await Leave.deleteMany({ employee: employee._id });

    // Delete employee image
    if (employee.image) {
      const imagePath = path.join(__dirname, `../../${employee.image}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Delete employee
    await Employee.findByIdAndDelete(employee._id);

    res.status(200).json({ message: "Employee and associated salaries/leaves deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error });
  }
};

export {
  getAllEmployees,
  addEmployees,
  updateEmployees,
  deleteEmployees
};
