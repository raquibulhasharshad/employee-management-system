import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App"; // Admin - Manage Employees
import Login from "./components/Login"; // Admin Login
import Signup from "./components/Signup"; // Admin Signup
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeProtectedRoute from "./components/EmployeeProtectedRoute";

import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import ChangePassword from "./components/ChangePassword";

import EmployeeLogin from "./components/EmployeeLogin";
import EmployeeNavbar from "./components/EmployeeNavbar";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployeeSettings from "./components/EmployeeSettings";
import MyProfile from "./components/MyProfile";
import RoleSelection from "./components/RoleSelection";

import AdminLeave from "./components/AdminLeave";
import EmployeeLeave from "./components/EmployeeLeave";

import AdminSalary from "./components/AdminSalary";
import EmployeeSalary from "./components/EmployeeSalary";

import AdminAttendance from "./components/AdminAttendance";
import EmployeeAttendance from "./components/EmployeeAttendance";

// 🔹 Forgot / Reset Password
import ForgotPassword from "./components/ForgotPassword"; // Admin forgot password
import ResetPassword from "./components/ResetPassword";   // Admin reset password
import EmployeeForgotPassword from "./components/EmployeeForgotPassword";
import EmployeeResetPassword from "./components/EmployeeResetPassword";

import "./index.css";

const AppWithNavbar = ({ children }) => {
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      <Navbar onLogout={handleLogout} />
      <main className="main-content-wrapper">{children}</main>
    </div>
  );
};

const EmployeeWithNavbar = ({ children }) => {
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/employee/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      <EmployeeNavbar onLogout={handleLogout} />
      <main className="main-content-wrapper">{children}</main>
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Role selection homepage */}
        <Route path="/" element={<RoleSelection />} />

        {/* ================== ADMIN ROUTES ================== */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <Dashboard />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employees"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <App />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leave"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <AdminLeave />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/salary"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <AdminSalary />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/attendance"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <AdminAttendance />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <Settings />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/change-password"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <ChangePassword />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />

        {/* ================== EMPLOYEE ROUTES ================== */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/forgot-password" element={<EmployeeForgotPassword />} />
        <Route path="/employee/reset-password/:token" element={<EmployeeResetPassword />} />

        <Route
          path="/employee/dashboard"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeDashboard />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <MyProfile />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/leave"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeLeave />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/salary"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeSalary />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeAttendance />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/settings"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeSettings />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/settings/change-password"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <ChangePassword />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
