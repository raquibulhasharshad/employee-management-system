import express from 'express';
import User from '../model/userModel';
import authService from '../service/auth';
import bcrypt from 'bcrypt';
import Employee from '../model/employeeModel';
import Salary from "../model/salaryModel";
import Leave from "../model/leaveModel";
import fs from "fs";
import path from "path";

const handleUserSignup = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { adminName, companyName, email, phone, address, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      adminName,
      companyName,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};

const handleUserLogin = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = authService.setUser(user);

    res.cookie('uid', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

const handleUserLogout = (req: express.Request, res: express.Response): void => {
  try {
    res.clearCookie('uid');
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

const handleGetAdminDetails = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin details", error });
  }
};

const handleUpdateAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { adminName, phone, address, companyName } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { adminName, phone, address, companyName },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

const handleChangePassword = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "New passwords do not match" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error });
  }
};



const handleDeleteAccount = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  try {
    const userId = (req as any).user.id;
    const { email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email !== email)
      return res.status(400).json({ message: "Incorrect email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Find all employees created by this admin
    const employees = await Employee.find({ createdBy: user._id.toString() });

    for (const emp of employees) {
      // Delete salaries
      await Salary.deleteMany({ employee: emp._id });

      // Delete leaves
      await Leave.deleteMany({ employee: emp._id });

      // Delete employee image
      if (emp.image) {
        const imagePath = path.join(__dirname, `../../${emp.image}`);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      // Delete employee
      await Employee.findByIdAndDelete(emp._id);
    }

    // Delete admin
    await User.findByIdAndDelete(userId);
    res.clearCookie("uid");

    return res
      .status(200)
      .json({ message: "Admin and all associated employees, salaries, and leaves deleted" });
  } catch (error) {
    console.error("Error deleting account", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const handleAuthCheck = (req: express.Request, res: express.Response): void => {
  try {
    const token = req.cookies?.uid;

    if (!token) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    const user = authService.getUser(token);

    if (!user) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    res.status(500).json({ message: "Authentication check failed", error });
  }
};

export {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  handleAuthCheck,
  handleGetAdminDetails,
  handleUpdateAdmin,
  handleChangePassword,
  handleDeleteAccount
};
