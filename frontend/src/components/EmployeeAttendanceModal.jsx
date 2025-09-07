import React from "react";
import "./EmployeeAttendanceModal.css";

const EmployeeAttendanceModal = ({ record, onClose }) => {
  if (!record) return null;

  const { date, checkIn, checkOut, status } = record;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Attendance Details</h3>

        <div className="attendance-details">
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Check-in:</strong> {checkIn || "-"}
          </p>
          <p>
            <strong>Check-out:</strong> {checkOut || "-"}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>

        <button className="employee-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeAttendanceModal;
