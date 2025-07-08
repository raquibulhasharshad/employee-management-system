import express from "express";

const validateEmployeeData = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const { name, email, address, phone } = req.body;

  if (!name || !email || !address || !phone) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400).json({ message: "Phone number must be 10 digits" });
    return;
  }

  next();
};

export default validateEmployeeData;
