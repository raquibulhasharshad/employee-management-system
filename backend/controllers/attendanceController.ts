import { Request, Response } from "express";
import Attendance from "../model/attendanceModel";
import Employee from "../model/employeeModel";
import Holiday from "../model/holidayModel";

// ✅ Get today's date in IST (YYYY-MM-DD)
const getISTDate = (): string => {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist.toISOString().split("T")[0]; // YYYY-MM-DD
};

// ✅ Get current time in IST (HH:mm)
const getISTTime = (): string => {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist.toTimeString().slice(0, 5); // HH:mm
};

// Admin → Open attendance for a date
const openAttendanceForDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ message: "Date is required" });
      return;
    }

    const istDate = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      .toISOString()
      .split("T")[0];

    const holiday = await Holiday.findOne({ date: istDate });
    if (holiday) {
      res.status(400).json({ message: "This date is a holiday" });
      return;
    }

    const adminId = (req as any).user?.id;
    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const employees = await Employee.find({ createdBy: adminId });

    for (const emp of employees) {
      const exists = await Attendance.findOne({ employee: emp._id, date: istDate });
      if (!exists) {
        await Attendance.create({ employee: emp._id, date: istDate, status: "Absent", checkIn: null, checkOut: null });
      }
    }

    res.json({ success: true, message: `Attendance opened for ${istDate}` });
  } catch (err) {
    res.status(500).json({ message: "Error opening attendance", error: err });
  }
};

// Admin → View attendance by date
const getAttendanceByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const istDate = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      .toISOString()
      .split("T")[0];

    const adminId = (req as any).user?.id;
    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const employees = await Employee.find({ createdBy: adminId }).select("_id");
    const employeeIds = employees.map((e) => e._id);

    const records = await Attendance.find({ date: istDate, employee: { $in: employeeIds } }).populate(
      "employee",
      "name image empId department"
    );

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err });
  }
};

// Employee → Check-in
const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?._id;
    if (!employeeId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const today = getISTDate();

    const record = await Attendance.findOne({ employee: employeeId, date: today });
    if (!record) {
      res.status(400).json({ message: "Attendance not opened for today" });
      return;
    }

    if (record.checkIn) {
      res.status(400).json({ message: "Already checked in" });
      return;
    }

    record.checkIn = getISTTime();
    record.status = "Present";
    await record.save();

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: "Check-in failed", error: err });
  }
};

// Employee → Check-out
const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?._id;
    if (!employeeId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const today = getISTDate();

    const record = await Attendance.findOne({ employee: employeeId, date: today });
    if (!record) {
      res.status(400).json({ message: "Attendance not opened for today" });
      return;
    }

    if (record.checkOut) {
      res.status(400).json({ message: "Already checked out" });
      return;
    }

    record.checkOut = getISTTime();
    if (!record.checkIn) record.status = "Half-day";
    await record.save();

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: "Check-out failed", error: err });
  }
};

// Admin → Update attendance manually
const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, checkIn, checkOut } = req.body;

    const record = await Attendance.findById(id);
    if (!record) {
      res.status(404).json({ message: "Record not found" });
      return;
    }

    record.checkIn = checkIn || null;
    record.checkOut = checkOut || null;

    record.status = status || (record.checkIn || record.checkOut ? "Present" : "Absent");

    await record.save();

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

// Employee → View my attendance
const getMyAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?._id;
    if (!employeeId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const records = await Attendance.find({ employee: employeeId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err });
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
