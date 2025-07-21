import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App'; // Employees dashboard
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';

import './index.css';


const Leave = () => <div className="page-wrapper"><h2>Leave Management</h2></div>;
const Salary = () => <div className="page-wrapper"><h2>Salary Management</h2></div>;

const isLoggedIn = () => document.cookie.includes('uid=');


const AppWithNavbar = ({ children }) => {
  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <Navbar onLogout={handleLogout} />
      <main className="main-content-wrapper">
        {children}
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
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
                <Leave />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/salary"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <Salary />
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
