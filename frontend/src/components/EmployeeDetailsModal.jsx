import React from 'react';
import './EmployeeDetailsModal.css';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay">
      <div className="employee-details-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="image-container">
          <img src={employee.image || '/default-user.png'} alt={employee.name} />
        </div>
        <h2 className="employee-name">{employee.name}</h2>
        <div className="details-grid">
          <div><strong>Employee ID:</strong> {employee.empId}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Phone:</strong> {employee.phone}</div>
          <div><strong>Gender:</strong> {employee.gender}</div>
          <div><strong>DOB:</strong> {employee.dob}</div>
          <div><strong>Department:</strong> {employee.department}</div>
          <div><strong>Position:</strong> {employee.position}</div>
          <div><strong>Skills:</strong> {employee.skills}</div>
          <div><strong>Address:</strong> {employee.address}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
