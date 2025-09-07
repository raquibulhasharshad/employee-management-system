import { Router } from "express";
import {
  openAttendanceForDate,
  checkIn,
  checkOut,
  updateAttendance,
  getMyAttendance,
  getAttendanceByDate,
} from "../controllers/attendanceController";
import restrictToLoggedinUserOnly from "../middlewares/auth";
import restrictToEmployeeOnly from "../middlewares/employeeAuth";

const attendanceRoute = Router();

// Admin
attendanceRoute.post("/open", restrictToLoggedinUserOnly, openAttendanceForDate);
attendanceRoute.put("/update/:id", restrictToLoggedinUserOnly, updateAttendance);
attendanceRoute.get("/date/:date", restrictToLoggedinUserOnly, getAttendanceByDate);

// Employee
attendanceRoute.post("/check-in", restrictToEmployeeOnly, checkIn);
attendanceRoute.post("/check-out", restrictToEmployeeOnly, checkOut);
attendanceRoute.get("/my", restrictToEmployeeOnly, getMyAttendance);

export default attendanceRoute;
