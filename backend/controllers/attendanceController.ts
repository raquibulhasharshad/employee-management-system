import { Request, Response } from "express";
import mongoose from "mongoose";
import Attendance from "../model/attendanceModel";
import Employee from "../model/employeeModel";
import Holiday from "../model/holidayModel";

// ✅ Get today's date in IST (YYYY-MM-DD)
const getISTDate = (): string => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return istTime.toISOString().split("T")[0];
};

// ✅ Get current time in IST (HH:mm)
const getISTTime = (): string => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return istTime.toTimeString().slice(0, 5); // HH:mm
};

// Admin → Open attendance for a date
const openAttendanceForDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const istDate = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      .toISOString()
      .split("T")[0];

    const holiday = await Holiday.findOne({ date: istDate });
    if (holiday) return res.status(400).json({ message: "This date is a holiday" });

    const adminId = (req as any).user.id;
    const employees = await Employee.find({ createdBy: adminId });

    for (const emp of employees) {
      const exists = await Attendance.findOne({
        employee: new mongoose.Types.ObjectId(emp._id),
        date: istDate,
      });
      if (!exists) {
        await Attendance.create({
          employee: new mongoose.Types.ObjectId(emp._id),
          date: istDate,
          status: "Absent",
          checkIn: null,
          checkOut: null,
        });
      }
    }

    return res.json({ success: true, message: `Attendance opened for ${istDate}` });
  } catch (err) {
    return res.status(500).json({ message: "Error opening attendance", error: err });
  }
};

// Admin → View attendance by date
const getAttendanceByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const istDate = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      .toISOString()
      .split("T")[0];

    const adminId = (req as any).user.id;
    const employees = await Employee.find({ createdBy: adminId }).select("_id");
    const employeeIds = employees.map((e) => new mongoose.Types.ObjectId(e._id));

    const records = await Attendance.find({
      date: istDate,
      employee: { $in: employeeIds },
    }).populate("employee", "name image empId department");

    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching attendance", error: err });
  }
};

// Employee → Check-in
const checkIn = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any)?.user?._id;
    const today = getISTDate();

    const record = await Attendance.findOne({
      employee: new mongoose.Types.ObjectId(employeeId),
      date: today,
    });
    if (!record) return res.status(400).json({ message: "Attendance not opened for today" });
    if (record.checkIn) return res.status(400).json({ message: "Already checked in" });

    record.checkIn = getISTTime();
    record.status = "Present";
    await record.save();

    return res.json({ success: true, record });
  } catch (err) {
    return res.status(500).json({ message: "Check-in failed", error: err });
  }
};

// Employee → Check-out
const checkOut = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any)?.user?._id;
    const today = getISTDate();

    const record = await Attendance.findOne({
      employee: new mongoose.Types.ObjectId(employeeId),
      date: today,
    });
    if (!record) return res.status(400).json({ message: "Attendance not opened for today" });
    if (record.checkOut) return res.status(400).json({ message: "Already checked out" });

    record.checkOut = getISTTime();
    if (!record.checkIn) record.status = "Half-day";
    await record.save();

    return res.json({ success: true, record });
  } catch (err) {
    return res.status(500).json({ message: "Check-out failed", error: err });
  }
};

// Admin → Update attendance manually
const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, checkIn, checkOut } = req.body;

    const record = await Attendance.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.checkIn = checkIn || null;
    record.checkOut = checkOut || null;

    if (!status) {
      if (record.checkIn && !record.checkOut) record.status = "Present";
      else if (!record.checkIn && !record.checkOut) record.status = "Absent";
      else if (record.checkIn && record.checkOut) record.status = "Present";
    } else {
      record.status = status;
    }

    await record.save();
    return res.json({ success: true, record });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err });
  }
};

// Employee → View my attendance
const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any)?.user?._id;
    const records = await Attendance.find({
      employee: new mongoose.Types.ObjectId(employeeId),
    }).sort({ date: -1 });

    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching attendance", error: err });
  }
};

export {
  openAttendanceForDate,
  getAttendanceByDate,
  checkIn,
  checkOut,
  updateAttendance,
  getMyAttendance,
};
