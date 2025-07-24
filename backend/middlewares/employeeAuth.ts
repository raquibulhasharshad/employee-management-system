import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, EMPLOYEE_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default restrictToEmployeeOnly;
