import React, { useState } from "react";
import "./Settings.css";
import { API_BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    currentPassword: form.currentPassword,
    newPassword: form.newPassword,
    confirmPassword: form.confirmPassword,
  }),
});


    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      } else {
        throw new Error("Unexpected response from server. Please log in again.");
      }
    }

    const data = await res.json();
    alert(data.message || "Password changed successfully");
    navigate("/dashboard/settings");
  } catch (error) {
    setError(error.message);
  }
};


  return (
    <div className="settings-container">
      <h2>Change Password</h2>
      <form className="form-group" onSubmit={handleSubmit}>
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

        <div className="settings-buttons">
          <button type="submit" className="save-btn">Update Password</button>
          <button
            type="button"
            className="edit-btn"
            onClick={() => navigate("/dashboard/settings")}
          >
            Admin Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
