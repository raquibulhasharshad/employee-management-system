import express from "express";

const validateEmployeeData = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const {name, email, address, phone, empId, department, position, gender, dob} = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (!phone) {
    res.status(400).json({ message: "Phone is required" });
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400).json({ message: "Phone number must be 10 digits" });
    return;
  }

  if (!address) {
    res.status(400).json({ message: "Address is required" });
    return;
  }

  if (!empId) {
    res.status(400).json({ message: "Employee ID is required" });
    return;
  }

  if (!department) {
    res.status(400).json({ message: "Department is required" });
    return;
  }

  if (!position) {
    res.status(400).json({ message: "Position is required" });
    return;
  }

  if (!gender) {
    res.status(400).json({ message: "Gender is required" });
    return;
  }

  if (!dob) {
    res.status(400).json({ message: "DOB is required" });
    return;
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) {
    res.status(400).json({ message: "DOB must be in YYYY-MM-DD format" });
    return;
  }

  next();
};

export default validateEmployeeData;
