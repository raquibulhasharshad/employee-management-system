import React from 'react';
import './EmployeeDetailsModal.css';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="details-overlay">
      <div className="details-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{employee.name}'s Profile</h2>
        <div className="details-content">
          <img
            src={employee.image || 'https://i.pravatar.cc/150?img=3'}
            alt={employee.name}
            className="details-image"
          />
          <div className="details-info">
            <p><strong>Employee ID:</strong> {employee.empId || 'N/A'}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Address:</strong> {employee.address}</p>
            <p><strong>Department:</strong> {employee.department || 'N/A'}</p>
            <p><strong>Skills:</strong> {employee.skills || 'N/A'}</p>
            <p><strong>Gender:</strong> {employee.gender || 'N/A'}</p>
            <p><strong>Position:</strong> {employee.position || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {employee.dob || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
