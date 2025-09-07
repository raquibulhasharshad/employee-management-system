import mongoose, { Schema, model } from "mongoose";

const holidaySchema = new Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  reason: { type: String },
});

const Holiday = model("Holiday", holidaySchema);
export default Holiday;
