import express from "express";
import path from "path";
import fs from "fs";
import Employee from "../model/employeeModel";

// Get all employees for logged-in user
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
      dob: emp.dob
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a new employee
const addEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newEmployee = new Employee({
      ...req.body,
      image: imagePath,
      createdBy: userId
    });

    await newEmployee.save();

    res.status(201).json({
      id: newEmployee._id,
      ...newEmployee.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add employee", error });
  }
};

// Update employee
const updateEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const existingEmployee = await Employee.findOne({ _id: id, createdBy: userId });
    if (!existingEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // If new image uploaded, delete old one and use new path
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;
      const oldImagePath = path.join(__dirname, `../../${existingEmployee.image}`);

      if (existingEmployee.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      req.body.image = newImagePath;
    }

    // If frontend says to remove image
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

// Delete employee
const deleteEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const deleted = await Employee.findOneAndDelete({ _id: id, createdBy: userId });
    if (!deleted) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Delete associated image file if exists
    if (deleted.image) {
      const imagePath = path.join(__dirname, `../../${deleted.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Employee deleted successfully" });
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
