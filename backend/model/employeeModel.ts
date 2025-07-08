import mongoose, { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  image: { type: String, default: "" },
  name: { type: String, required: true },
  empId: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String },
  position: { type: String },
  gender: { type: String },
  skills: { type: String },
  dob: { type: String },
  createdBy: { type: String, required: true }
});

const Employee = model("Employee", employeeSchema);
export default Employee;
