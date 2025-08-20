import React from 'react';
import './LeaveDetailsModal.css';
import { API_BASE_URL } from '../constants';

const LeaveDetailsModal = ({ leave, onClose, onStatusChange }) => {
  const handleAction = async (status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leave/${leave.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        onStatusChange();
        onClose();
      } else {
        alert(data.message || "Failed to update leave status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong while updating status.");
    }
  };

  const getImageUrl = (img) => {
    if (!img) {
      return 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg';
    }
    return img.startsWith('/uploads') ? `${API_BASE_URL.replace('/api', '')}${img}` : img;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return isNaN(d) ? 'Invalid Date' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const employee = leave.employee || {};
  const name = leave.name || employee.name || 'N/A';
  const empId = leave.empId || employee.empId || 'N/A';
  const department = leave.department || employee.department || 'N/A';
  const leaveType = leave.leaveType || 'N/A';
  const reason = leave.description || leave.reason || 'N/A';
  const startDate = formatDate(leave.startDate || leave.fromDate);
  const endDate = formatDate(leave.endDate || leave.toDate);
  const appliedOn = formatDate(leave.appliedAt);
  const image = getImageUrl(leave.image || employee.image);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Leave Request Details</h3>

        <div className="modal-profile">
          <img src={image} alt="Employee" className="modal-profile-img" />
          <div className="modal-profile-info">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Emp ID:</strong> {empId}</p>
            <p><strong>Department:</strong> {department}</p>
          </div>
        </div>

        <div className="modal-leave-info">
          <p><strong>Leave Type:</strong> {leaveType}</p>
          <p><strong>From:</strong> {startDate}</p>
          <p><strong>To:</strong> {endDate}</p>
          <p><strong>Applied On:</strong> {appliedOn}</p>
        </div>

        <div className="modal-description">
          <p><strong>Description:</strong></p>
          <p className="description-text">{reason}</p>
        </div>

        <div className="modal-actions">
          <button className="Approve" onClick={() => handleAction('Approved')}>Approve</button>
          <button className="Reject" onClick={() => handleAction('Rejected')}>Reject</button>
          <button className="Close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
