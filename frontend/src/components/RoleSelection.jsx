import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <h2>Welcome to Employee Management System</h2>
      <div className="role-buttons">
        <button onClick={() => navigate('/admin/login')}>Admin Login</button>
        <button onClick={() => navigate('/employee/login')}>Employee Login</button>
      </div>
    </div>
  );
};

export default RoleSelection;
