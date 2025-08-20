import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Employee from "../model/employeeModel"; // ✅ Make sure this path is correct

const EMPLOYEE_SECRET = "employee$auth123";

const restrictToEmployeeOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.eid;
  if (!token) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  try {
    const decoded = jwt.verify(token, EMPLOYEE_SECRET) as { id: string };

    // ✅ Fetch employee from DB to get full details
    const employee = await Employee.findById(decoded.id).select("-password");
    if (!employee) {
      res.status(401).json({ message: "Unauthorized: Employee not found" });
      return;
    }

    (req as any).user = employee; // ✅ Attach full employee object
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default restrictToEmployeeOnly;
