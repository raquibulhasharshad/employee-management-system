import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeSettings.css";

const EmployeeSettings = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/employee/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message || "Failed to change password");
        } else {
          throw new Error("Unexpected response. Please log in again.");
        }
      }

      const data = await res.json();
      setMessage(data.message || "Password changed successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-box">
        <h2 className="settings-heading">Change Password</h2>
        <form className="settings-form" onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <div className="settings-buttons">
            <button type="submit" className="save-btn">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSettings;
