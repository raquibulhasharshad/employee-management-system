import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({
  isDeleteDisabled = true,
  isMailDisabled = true,
  onDelete = () => {},
  onAdd = () => {},
  onMail = () => {}
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname.startsWith('/dashboard/settings')) return 'Settings';
    if (location.pathname.startsWith('/dashboard/salary')) return 'Manage Salary';
    if (location.pathname.startsWith('/dashboard/leave')) return 'Manage Leaves';
    if (location.pathname.startsWith('/dashboard/employees')) return 'Manage Employees';
    return 'Dashboard';
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        navigate('/');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={() =>
                location.pathname === '/dashboard' ? 'active' : ''
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/employees"
              className={() =>
                location.pathname.startsWith('/dashboard/employees') ? 'active' : ''
              }
            >
              Employees
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/leave"
              className={() =>
                location.pathname.startsWith('/dashboard/leave') ? 'active' : ''
              }
            >
              Leave
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/salary"
              className={() =>
                location.pathname.startsWith('/dashboard/salary') ? 'active' : ''
              }
            >
              Salary
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={() =>
                location.pathname.startsWith('/dashboard/settings') ? 'active' : ''
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </aside>

      <nav className="navbar">
        <div className="navbar-left">{getTitle()}</div>
        <div className="navbar-right">
          {location.pathname.startsWith('/dashboard/employees') && (
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
          )}
          <button className="Logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
