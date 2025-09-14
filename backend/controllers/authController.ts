import express, { CookieOptions } from 'express';
import User from '../model/userModel';
import authService from '../service/auth';
import bcrypt from 'bcrypt';
import Employee from '../model/employeeModel';
import Salary from "../model/salaryModel";
import Leave from "../model/leaveModel";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const otpStore: Record<string, { otp: string; expires: number }> = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ---------------- Helper for cookie ---------------- */
const getCookieOptions = (isProduction: boolean): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: '/', // added to make clearCookie work reliably
});

/* ---------------- Signup ---------------- */
const handleUserSignup = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { adminName, companyName, email, phone, address, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ adminName, companyName, email, phone, address, password: hashedPassword });
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};

/* ---------------- Login ---------------- */
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
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('uid', token, getCookieOptions(isProduction));

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

/* ---------------- Logout ---------------- */
const handleUserLogout = (req: express.Request, res: express.Response): void => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('uid', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

/* ---------------- Get admin details ---------------- */
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

/* ---------------- Update admin ---------------- */
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

/* ---------------- Change password ---------------- */
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
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error });
  }
};

/* ---------------- Forgot password ---------------- */
const handleForgotPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "EMS Admin Password Reset",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

/* ---------------- Reset password ---------------- */
const handleResetPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || record.expires < Date.now()) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    delete otpStore[email];
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error });
  }
};

/* ---------------- Delete account ---------------- */
const handleDeleteAccount = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.email !== email) {
      res.status(400).json({ message: "Incorrect email" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    const employees = await Employee.find({ createdBy: user._id.toString() });
    for (const emp of employees) {
      await Salary.deleteMany({ employee: emp._id });
      await Leave.deleteMany({ employee: emp._id });
      if (emp.image) {
        const imagePath = path.join(__dirname, `../../${emp.image}`);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      await Employee.findByIdAndDelete(emp._id);
    }

    await User.findByIdAndDelete(userId);

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("uid", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    res.status(200).json({ message: "Admin and all associated data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

/* ---------------- Auth check ---------------- */
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
  handleDeleteAccount,
  handleForgotPassword,
  handleResetPassword
};
