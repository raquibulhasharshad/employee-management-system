import React, { useState, useEffect } from "react";
import "./AdminAttendanceModal.css";
import { API_BASE_URL } from "../constants";

const AdminAttendanceModal = ({ record, onClose, onUpdated }) => {
  const [status, setStatus] = useState("Present");
  const [checkIn, setCheckIn] = useState(record.checkIn || "");
  const [checkOut, setCheckOut] = useState(record.checkOut || "");
  const [loading, setLoading] = useState(false);

  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  useEffect(() => {
    setCheckIn(record.checkIn || "");
    setCheckOut(record.checkOut || "");
    setStatus(record.status || "Absent"); // ✅ initialize directly from DB
  }, [record]);

  const getValidStatusOptions = () => {
    const options = [];
    if (checkIn && checkOut) options.push("Present", "Half-day");
    else if (checkIn && !checkOut) options.push("Present", "Half-day");
    else if (!checkIn && !checkOut) options.push("Absent");
    return options;
  };

  const handleSave = async () => {
    const validStatuses = getValidStatusOptions();
    if (!validStatuses.includes(status)) {
      alert("Invalid status for the given check-in/out times");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
      };

      const res = await fetch(
        `${API_BASE_URL}/attendance/update/${record._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        onUpdated();
        onClose();
      } else {
        alert(data.message || "Failed to update attendance");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) =>
    !img
      ? defaultAvatar
      : img.startsWith("/uploads")
      ? `${API_BASE_URL.replace("/api", "")}${img}`
      : img;

  const validOptions = getValidStatusOptions();

  return (
    <div className="admin-attendance-modal-backdrop">
      <div className="admin-attendance-modal">
        <h3>Update Attendance</h3>

        {/* Employee Preview Section */}
        <div className="employee-preview">
          <img
            src={getImageUrl(record.employee?.image)}
            alt={record.employee?.name}
            className="employee-img"
          />
          <div className="employee-info">
            <p>
              <strong>Name:</strong> {record.employee?.name}
            </p>
            <p>
              <strong>Emp ID:</strong> {record.employee?.empId}
            </p>
            <p>
              <strong>Department:</strong> {record.employee?.department || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {record.date}
            </p>
          </div>
        </div>

        {/* Status & Time Inputs */}
        <div className="field">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["Present", "Half-day", "Absent"].map((s) => (
              <option key={s} value={s} disabled={!validOptions.includes(s)}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Check-in Time:</label>
          <input
            type="time"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Check-out Time:</label>
          <input
            type="time"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="admin-attendance-actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceModal;
