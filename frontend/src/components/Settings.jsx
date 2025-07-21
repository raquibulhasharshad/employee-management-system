import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import { API_BASE_URL } from "../constants";

const Settings = () => {
  const [admin, setAdmin] = useState(null);
  const [originalAdmin, setOriginalAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/profile`, {
      credentials: "include",
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Unauthorized"))
      .then((data) => {
        setAdmin(data);
        setOriginalAdmin(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading admin profile.");
      });
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCancel = () => {
    setAdmin(originalAdmin);
    setEditMode(false);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};

    if (!admin.adminName) newErrors.adminName = "Admin Name is required";
    if (!admin.companyName) newErrors.companyName = "Company Name is required";

    if (!admin.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(admin.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!admin.phone) {
      newErrors.phone = "Phone is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(admin.phone)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(admin),
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Update failed"))
      .then((data) => {
        setAdmin(data);
        setOriginalAdmin(data);
        setEditMode(false);
        alert("Profile updated.");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update profile.");
      });
  };

  if (!admin) return <div className="settings-container">Loading admin details...</div>;

  return (
    <div className="settings-container">
      <h2>Admin Settings</h2>

      {["adminName", "companyName", "email", "phone", "address"].map((field) => (
        <div key={field} className="form-group">
          <label>
            {field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={admin[field] || ""}
            onChange={handleChange}
            disabled={!editMode || field === "email"}
          />
          {editMode && errors[field] && (
            <p className="error-message">{errors[field]}</p>
          )}
        </div>
      ))}

      <div className="settings-buttons">
        {!editMode ? (
          <>
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button
              className="change-password-btn"
              onClick={() => navigate("/dashboard/settings/change-password")}
            >
              Change Password
            </button>
          </>
        ) : (
          <>
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
