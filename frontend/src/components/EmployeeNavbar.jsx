import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { API_BASE_URL } from '../constants';

const EmployeeNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname.includes('/employee/settings')) return 'Settings';
    if (location.pathname.includes('/employee/dashboard')) return 'Dashboard';
    return 'Employee Panel';
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employee/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        navigate('/');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Employee Logout Error:', error);
      alert('Something went wrong while logging out.');
    }
  };

  return (
    <>
      <div className="sidebar">
        <h2>Employee Panel</h2>
        <ul>
          <li>
            <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              Settings
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar">
        <div className="navbar-left">{getTitle()}</div>
        <div className="navbar-right">
          <button className="Logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default EmployeeNavbar;
