import express from "express";

const validateSignupFields = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const {adminName, companyName, email, phone, password } = req.body;

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


  next();
};

export default validateSignupFields;
