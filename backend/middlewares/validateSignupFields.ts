import express from "express";
import User from "../model/userModel"; // <-- make sure this points to your Admin/User schema

const validateSignupFields = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const { adminName, companyName, email, phone, password } = req.body;

  if (!adminName) {
    res.status(400).json({ message: "Admin Name is required" });
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

  if (!companyName) {
    res.status(400).json({ message: "CompanyName is required" });
    return;
  }

  if (!password || password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  // ➡️ NEW: check if email already exists
  User.findOne({ email })
    .then((existing) => {
      if (existing) {
        res.status(400).json({ message: "Email ID already exists" });
        return;
      }
      next();
    })
    .catch(() => {
      res.status(500).json({ message: "Server error while checking email" });
    });
};

export default validateSignupFields;
