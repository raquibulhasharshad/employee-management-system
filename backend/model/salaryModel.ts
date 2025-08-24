import mongoose, { Schema, model } from "mongoose";

const salarySchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Added
  basicSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  month: { type: String, required: true }, // e.g. "August-2025"
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  createdAt: { type: Date, default: Date.now }
});

const Salary = model("Salary", salarySchema);
export default Salary;
