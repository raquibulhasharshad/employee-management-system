import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';

const EmployeeProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState({ checked: false, loggedIn: false });

  useEffect(() => {
    fetch(`${API_BASE_URL}/employee/auth/check`, {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((res) => setAuth({ checked: true, loggedIn: res.ok }))
      .catch(() => setAuth({ checked: true, loggedIn: false }));
  }, []);

  if (!auth.checked) return <div>Loading...</div>;
  if (!auth.loggedIn) return <Navigate to="/employee/login" replace />;
  return children;
};

export default EmployeeProtectedRoute;
