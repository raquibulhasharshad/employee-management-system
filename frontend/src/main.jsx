// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import App from './App'; // Admin - Manage Employees
// import Login from './components/Login'; // Admin Login
// import Signup from './components/Signup'; // Admin Signup
// import ProtectedRoute from './components/ProtectedRoute';
// import EmployeeProtectedRoute from './components/EmployeeProtectedRoute';

// import Dashboard from './components/Dashboard';
// import Navbar from './components/Navbar';
// import Settings from './components/Settings';
// import ChangePassword from './components/ChangePassword';

// import EmployeeLogin from './components/EmployeeLogin';
// import EmployeeNavbar from './components/EmployeeNavbar';
// import EmployeeDashboard from './components/EmployeeDashboard';
// import EmployeeSettings from './components/EmployeeSettings';
// import MyProfile from './components/MyProfile'; // ✅ Imported MyProfile
// import RoleSelection from './components/RoleSelection';

// import './index.css';

// const AppWithNavbar = ({ children }) => {
//   const handleLogout = async () => {
//     await fetch('http://localhost:5000/api/auth/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     window.location.href = '/';
//   };

//   return (
//     <div className="app-container">
//       <Navbar onLogout={handleLogout} />
//       <main className="main-content-wrapper">{children}</main>
//     </div>
//   );
// };

// const EmployeeWithNavbar = ({ children }) => {
//   const handleLogout = async () => {
//     await fetch('http://localhost:5000/api/auth/employee/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     window.location.href = '/';
//   };

//   return (
//     <div className="app-container">
//       <EmployeeNavbar onLogout={handleLogout} />
//       <main className="main-content-wrapper">{children}</main>
//     </div>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         {/* Role selection homepage */}
//         <Route path="/" element={<RoleSelection />} />

//         {/* Admin routes */}
//         <Route path="/admin/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <AppWithNavbar>
//                 <Dashboard />
//               </AppWithNavbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard/employees"
//           element={
//             <ProtectedRoute>
//               <AppWithNavbar>
//                 <App />
//               </AppWithNavbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard/settings"
//           element={
//             <ProtectedRoute>
//               <AppWithNavbar>
//                 <Settings />
//               </AppWithNavbar>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard/settings/change-password"
//           element={
//             <ProtectedRoute>
//               <AppWithNavbar>
//                 <ChangePassword />
//               </AppWithNavbar>
//             </ProtectedRoute>
//           }
//         />

//         {/* Employee routes */}
//         <Route path="/employee/login" element={<EmployeeLogin />} />
//         <Route
//           path="/employee/dashboard"
//           element={
//             <EmployeeProtectedRoute>
//               <EmployeeWithNavbar>
//                 <EmployeeDashboard />
//               </EmployeeWithNavbar>
//             </EmployeeProtectedRoute>
//           }
//         />
//         <Route
//           path="/employee/settings"
//           element={
//             <EmployeeProtectedRoute>
//               <EmployeeWithNavbar>
//                 <EmployeeSettings />
//               </EmployeeWithNavbar>
//             </EmployeeProtectedRoute>
//           }
//         />
//         <Route
//           path="/employee/profile" // ✅ MyProfile route
//           element={
//             <EmployeeProtectedRoute>
//               <EmployeeWithNavbar>
//                 <MyProfile />
//               </EmployeeWithNavbar>
//             </EmployeeProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App'; // Admin - Manage Employees
import Login from './components/Login'; // Admin Login
import Signup from './components/Signup'; // Admin Signup
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeProtectedRoute from './components/EmployeeProtectedRoute';

import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';

import EmployeeLogin from './components/EmployeeLogin';
import EmployeeNavbar from './components/EmployeeNavbar';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeSettings from './components/EmployeeSettings';
import MyProfile from './components/MyProfile';
import RoleSelection from './components/RoleSelection';

import AdminLeave from './components/AdminLeave'; // ✅ New
import EmployeeLeave from './components/EmployeeLeave'; // ✅ New

import './index.css';

const AppWithNavbar = ({ children }) => {
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <Navbar onLogout={handleLogout} />
      <main className="main-content-wrapper">{children}</main>
    </div>
  );
};

const EmployeeWithNavbar = ({ children }) => {
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/employee/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <EmployeeNavbar onLogout={handleLogout} />
      <main className="main-content-wrapper">{children}</main>
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Role selection homepage */}
        <Route path="/" element={<RoleSelection />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <Dashboard />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employees"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <App />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leave"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <AdminLeave />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <Settings />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/change-password"
          element={
            <ProtectedRoute>
              <AppWithNavbar>
                <ChangePassword />
              </AppWithNavbar>
            </ProtectedRoute>
          }
        />

        {/* Employee routes */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeDashboard />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/settings"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeSettings />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/settings/change-password"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <ChangePassword />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <MyProfile />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
        <Route
          path="/employee/leave"
          element={
            <EmployeeProtectedRoute>
              <EmployeeWithNavbar>
                <EmployeeLeave />
              </EmployeeWithNavbar>
            </EmployeeProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
