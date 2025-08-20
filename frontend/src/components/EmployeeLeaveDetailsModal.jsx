import React from 'react';
import './EmployeeLeaveDetailsModal.css';
import { API_BASE_URL } from '../constants';

const EmployeeLeaveDetailsModal = ({ leave, onClose }) => {
  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return isNaN(d) ? 'Invalid Date' : d.toLocaleDateString();
  };

  return (
    <div className="emp-modal-overlay" onClick={onClose}>
      <div className="emp-modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Leave Request Details</h3>

        <div className="emp-modal-info">
          <p><strong>Leave Type:</strong> <span className="highlight">{leave.leaveType}</span></p>
          <p><strong>From:</strong> {formatDate(leave.fromDate)}</p>
          <p><strong>To:</strong> {formatDate(leave.toDate)}</p>
          <p><strong>Applied On:</strong> {formatDate(leave.appliedAt)}</p>
          <p><strong>Status:</strong> <span className={`status-${leave.status.toLowerCase()}`}>{leave.status}</span></p>
        </div>

        <div className="emp-modal-description">
          <p><strong>Description:</strong></p>
          <p>{leave.description || 'No description provided.'}</p>
        </div>

        <div className="emp-modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveDetailsModal;
