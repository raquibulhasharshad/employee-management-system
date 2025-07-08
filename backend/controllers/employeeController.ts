import express from "express";
import Employee from "../model/employeeModel";

const getAllEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
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

const addEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const newEmployee = new Employee({
      ...req.body,
      createdBy: userId
    });

    await newEmployee.save();

    res.status(201).json({
      id: newEmployee._id,
      ...req.body
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add employee", error });
  }
};

const updateEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const updated = await Employee.findOneAndUpdate(
      { _id: id, createdBy: userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({
      id: updated._id,
      ...req.body
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update employee", error });
  }
};

const deleteEmployees = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const deleted = await Employee.findOneAndDelete({ _id: id, createdBy: userId });

    if (!deleted) {
      res.status(404).json({ message: "Employee not found" });
      return;
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
