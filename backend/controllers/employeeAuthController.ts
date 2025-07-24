import express from "express";
import Employee from "../model/employeeModel";
import bcrypt from "bcrypt";
import employeeAuthService from "../service/employeeAuthService";

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

export {
  handleEmployeeLogin,
  handleEmployeeLogout,
  handleEmployeeAuthCheck,
  handleEmployeeChangePassword
};
