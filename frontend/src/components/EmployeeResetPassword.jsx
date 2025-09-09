import React, { useState } from "react";
import { API_BASE_URL } from "../constants";
import "./Auth.css";

const EmployeeForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError(""); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/employee/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setOtpSent(true);
      else setError(data.message || "Failed to send OTP");
    } catch {
      setError("Something went wrong");
    }
  };

  const resetPassword = async () => {
    setError(""); setMessage("");
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/employee/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (res.ok) setMessage("Password reset successful!");
      else setError(data.message || "Failed to reset password");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Employee Forgot Password</h2>
      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter your employee email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EmployeeForgotPassword;
