import React from 'react';
import './EmployeeSalaryDetailsModal.css';

const EmployeeSalaryDetailsModal = ({ salary, onClose }) => {
  if (!salary) return null;

  return (
    <div className="emp-modal-overlay" onClick={onClose}>
      <div className="emp-modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Salary Details</h3>

        <div className="emp-modal-info">
          <p><strong>Month:</strong> <span className="highlight">{salary.month}</span></p>
          <p><strong>Basic Salary:</strong> {salary.basicSalary}</p>
          <p><strong>Bonus:</strong> {salary.bonus}</p>
          <p><strong>Deductions:</strong> {salary.deductions}</p>
          <p><strong>Net Salary:</strong> {salary.netSalary}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-${salary.status?.toLowerCase()}`}>
              {salary.status}
            </span>
          </p>
        </div>

        <div className="emp-modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryDetailsModal;
