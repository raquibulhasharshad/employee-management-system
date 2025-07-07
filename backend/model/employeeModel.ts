import mongoose, { Schema, model } from "mongoose";

const employeeSchema = new Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    createdBy: { type: String, required: true }
});

const Employee = model('Employee', employeeSchema);

export default Employee;
