import React from 'react';
import './Navbar.css';

const Navbar = ({ isDeleteDisabled, isMailDisabled, onDelete, onAdd, onMail }) => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">Manage Employees</div>
      <div className="navbar-right">
        <div className="action-buttons">
          <button
            className={`Mail ${isMailDisabled ? 'inactive' : ''}`}
            onClick={onMail}
            disabled={isMailDisabled}
          >
            📧 Mail
          </button>
          <button
            className={`Del ${isDeleteDisabled ? 'inactive' : ''}`}
            onClick={onDelete}
            disabled={isDeleteDisabled}
          >
            🗑️ Delete
          </button>
          <button className="Add" onClick={onAdd}>
            ➕ Add New Employee
          </button>
        </div>
        <button className="Logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
