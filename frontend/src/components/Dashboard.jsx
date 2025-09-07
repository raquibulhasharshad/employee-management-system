import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { API_BASE_URL } from "../constants";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [presentEmployees, setPresentEmployees] = useState(0);
  const [absentEmployees, setAbsentEmployees] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch total employees
  const fetchEmployees = async () => {
    const res = await fetch(`${API_BASE_URL}/employees`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setTotalEmployees(data.length);
    }
  };

  // Fetch leaves (all-time)
  const fetchLeaves = async () => {
    const res = await fetch(`${API_BASE_URL}/leave/all`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      const allLeaves = data.leaves || [];
      setPendingLeaves(allLeaves.filter(l => l.status === "Pending").length);
      setApprovedLeaves(allLeaves.filter(l => l.status === "Approved").length);
    }
  };

  // Fetch attendance (today’s status only, local timezone)
  const fetchAttendance = async () => {
    const today = new Date();
    const localDate = today.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    const res = await fetch(`${API_BASE_URL}/attendance/date/${localDate}`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setPresentEmployees(data.filter(a => a.status === "Present").length);
      setAbsentEmployees(data.filter(a => a.status === "Absent").length);
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchAttendance();
  }, []);

  return (
    <div className="main-content">
      <Navbar />
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome Admin 👋</h2>
        <p className="dashboard-time">
          {currentTime.toLocaleDateString()}{" "}
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div className="dashboard-cards">
        <div className="card blue">
          <h3>Total Employees</h3>
          <p>{totalEmployees}</p>
        </div>
        <div className="card orange">
          <h3>Total Pending Leaves</h3>
          <p>{pendingLeaves}</p>
        </div>
        <div className="card green">
          <h3>Total Approved Leaves</h3>
          <p>{approvedLeaves}</p>
        </div>
        <div className="card teal">
          <h3>Present Today</h3>
          <p>{presentEmployees}</p>
        </div>
        <div className="card red">
          <h3>Absent Today</h3>
          <p>{absentEmployees}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
