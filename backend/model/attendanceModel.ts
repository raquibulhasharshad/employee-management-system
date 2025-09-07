import mongoose, { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: { type: String }, // HH:mm
  checkOut: { type: String }, // HH:mm
  status: { type: String, enum: ["Pending", "Present", "Absent", "Half-day"], default: "Pending" },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = model("Attendance", attendanceSchema);
export default Attendance;
