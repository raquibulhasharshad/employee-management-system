import React, { useEffect, useState } from "react";
import "./EmployeeDashboard.css";
import { API_BASE_URL } from "../constants";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeDashboard = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeImage, setEmployeeImage] = useState("");
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [attendance, setAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper to get full image URL
  const getEmployeeImageUrl = (img) => {
    if (img) return img.startsWith("/uploads") ? `${API_BASE_URL.replace("/api", "")}${img}` : img;
    return "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  };

  const fetchEmployeeProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employee/auth/profile`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEmployeeName(data.name);
        setEmployeeImage(data.image);
      }
    } catch (err) {
      console.error("Failed to fetch employee profile:", err);
    }
  };

  const fetchEmployeeLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leave/my`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const thisMonthLeaves = data.filter((l) => {
          const applied = new Date(l.appliedAt);
          return applied.getMonth() === currentMonth && applied.getFullYear() === currentYear;
        });

        setPendingLeaves(thisMonthLeaves.filter((l) => l.status === "Pending").length);
        setApprovedLeaves(thisMonthLeaves.filter((l) => l.status === "Approved").length);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/my`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const todayRecord = data.find((a) => a.date === today) || null;
        setAttendance(todayRecord);
      }
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
    fetchEmployeeLeaves();
    fetchTodayAttendance();
  }, []);

  return (
    <div className="main-content">
      <EmployeeNavbar />

      {/* Header with profile & time */}
      <div className="employee-dashboard-header">
        <div className="employee-dashboard-info">
          <img src={getEmployeeImageUrl(employeeImage)} alt="Profile" className="employee-dashboard-img" />
          <h2 className="employee-dashboard-welcome">Welcome, {employeeName} 👋</h2>
        </div>
        <p className="employee-dashboard-time">
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="employee-dashboard-cards">
        <div className="card orange">
          <h3>Pending Leaves (This Month)</h3>
          <p>{pendingLeaves}</p>
        </div>
        <div className="card green">
          <h3>Approved Leaves (This Month)</h3>
          <p>{approvedLeaves}</p>
        </div>

        <div className={`card ${attendance?.checkOut ? "gray" : "teal"}`}>
          <h3>Attendance Today</h3>
          {attendance ? (
            <p>
              Check-In: {attendance.checkIn || "--"} <br />
              Check-Out: {attendance.checkOut || "--"}
            </p>
          ) : (
            <p>No attendance recorded today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
