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
    return isNaN(d)
      ? 'Invalid Date'
      : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return 'N/A';
    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(start) || isNaN(end)) return 'N/A';
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diff > 0 ? diff : 'N/A';
  };

  const employee = leave.employee || {};
  const name = leave.name || employee.name || 'N/A';
  const empId = leave.empId || employee.empId || 'N/A';
  const department = leave.department || employee.department || 'N/A';
  const leaveType = leave.leaveType || 'N/A';
  const reason = leave.description || leave.reason || 'N/A';
  const startRaw = leave.startDate || leave.fromDate;
  const endRaw = leave.endDate || leave.toDate;
  const startDate = formatDate(startRaw);
  const endDate = formatDate(endRaw);
  const appliedOn = formatDate(leave.appliedAt);
  const days = calculateDays(startRaw, endRaw);
  const image = getImageUrl(leave.image || employee.image);

  // ✅ check if leave status is already finalized
  const isFinalized = leave.status === 'Approved' || leave.status === 'Rejected';

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
          <p><strong>Days:</strong> {days}</p>
          <p><strong>Applied On:</strong> {appliedOn}</p>
          <p><strong>Status:</strong> {leave.status}</p>
        </div>

        <div className="modal-description">
          <p><strong>Description:</strong></p>
          <p className="description-text">{reason}</p>
        </div>

        <div className="modal-actions">
          <button
            className="Approve"
            disabled={isFinalized}
            onClick={() => handleAction('Approved')}
          >
            Approve
          </button>
          <button
            className="Reject"
            disabled={isFinalized}
            onClick={() => handleAction('Rejected')}
          >
            Reject
          </button>
          <button className="Close" onClick={onClose}>Close</button>
        </div>

        {/* ✅ Show message if already approved/rejected */}
        {isFinalized && (
          <p className={`status-note ${leave.status}`}>
            This leave has already been {leave.status}.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
