import express from "express";

// Validation for adding salary
export const validateAddSalaryData = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const { employeeId, basicSalary, bonus, deductions, month, status } = req.body;

  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" });
    return;
  }

  if (basicSalary === undefined || isNaN(basicSalary) || basicSalary < 0) {
    res.status(400).json({ message: "Basic Salary must be a non-negative number" });
    return;
  }

  if (bonus === undefined || isNaN(bonus) || bonus < 0) {
    res.status(400).json({ message: "Bonus must be a non-negative number" });
    return;
  }

  if (deductions === undefined || isNaN(deductions) || deductions < 0) {
    res.status(400).json({ message: "Deductions must be a non-negative number" });
    return;
  }

  if (!month) {
    res.status(400).json({ message: "Month is required" });
    return;
  }
  const monthRegex = /^(0[1-9]|1[0-2])-(\d{4})$/; // MM-YYYY
  if (!monthRegex.test(month)) {
    res.status(400).json({ message: "Month must be in MM-YYYY format" });
    return;
  }

  const allowedStatuses = ["Paid", "Unpaid"];
  if (!status || !allowedStatuses.includes(status)) {
    res.status(400).json({ message: "Status must be either 'Paid' or 'Unpaid'" });
    return;
  }

  next();
};

// Validation for updating salary
export const validateUpdateSalaryData = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const { basicSalary, bonus, deductions, month, status } = req.body;

  if (basicSalary !== undefined && (isNaN(basicSalary) || basicSalary < 0)) {
    res.status(400).json({ message: "Basic Salary must be a non-negative number" });
    return;
  }

  if (bonus !== undefined && (isNaN(bonus) || bonus < 0)) {
    res.status(400).json({ message: "Bonus must be a non-negative number" });
    return;
  }

  if (deductions !== undefined && (isNaN(deductions) || deductions < 0)) {
    res.status(400).json({ message: "Deductions must be a non-negative number" });
    return;
  }

  if (month) {
    const monthRegex = /^(0[1-9]|1[0-2])-(\d{4})$/;
    if (!monthRegex.test(month)) {
      res.status(400).json({ message: "Month must be in MM-YYYY format" });
      return;
    }
  }

  if (status) {
    const allowedStatuses = ["Paid", "Unpaid"];
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Status must be either 'Paid' or 'Unpaid'" });
      return;
    }
  }

  next();
};
