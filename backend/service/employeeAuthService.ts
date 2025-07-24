import jwt from "jsonwebtoken";

const EMPLOYEE_SECRET = "employee$auth123";

function setEmployeeToken(employee: any) {
  const payload = {
    id: employee._id,
    email: employee.email,
  };
  return jwt.sign(payload, EMPLOYEE_SECRET, { expiresIn: "2h" });
}

function getEmployeeFromToken(token: string) {
  if (!token) return null;
  try {
    return jwt.verify(token, EMPLOYEE_SECRET);
  } catch (err) {
    return null;
  }
}

export default {
  setEmployeeToken,
  getEmployeeFromToken,
};
