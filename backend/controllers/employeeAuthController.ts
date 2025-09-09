import express from "express";
import Employee from "../model/employeeModel";
import bcrypt from "bcrypt";
import employeeAuthService from "../service/employeeAuthService";
import nodemailer from "nodemailer";

const otpStore: Record<string, { otp: string; expires: number }> = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const handleEmployeeLogin = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee || !employee.password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = employeeAuthService.setEmployeeToken(employee);
    res.cookie("eid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

const handleEmployeeLogout = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    res.clearCookie("eid");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err });
  }
};

const handleEmployeeAuthCheck = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const token = req.cookies?.eid;
    if (!token) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    const user = employeeAuthService.getEmployeeFromToken(token);
    if (!user) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    res.status(200).json({ message: "Authenticated" });
  } catch (err) {
    res.status(500).json({ message: "Auth check failed", error: err });
  }
};

const handleEmployeeChangePassword = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const empId = (req as any).user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const employee = await Employee.findById(empId);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    employee.password = hashed;
    await employee.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err });
  }
};

const handleGetEmployeeDetails = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const employee = await Employee.findById(userId).select("-password");

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Employee details", error });
  }
};

// ------------------- Forgot Password (Employee) -------------------

const handleEmployeeForgotPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "EMS Employee Password Reset",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

const handleEmployeeResetPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];

    if (!record || record.otp !== otp || record.expires < Date.now()) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    employee.password = await bcrypt.hash(newPassword, 10);
    await employee.save();
    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error });
  }
};

export {
  handleEmployeeLogin,
  handleEmployeeLogout,
  handleEmployeeAuthCheck,
  handleEmployeeChangePassword,
  handleGetEmployeeDetails,
  handleEmployeeForgotPassword,
  handleEmployeeResetPassword
};
