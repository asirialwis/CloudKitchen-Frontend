import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import { toast } from 'react-toastify';
import { useRef } from 'react';

const ProtectedRoute = () => {
  const toastShown = useRef(false);

  if (!isAuthenticated() && !toastShown.current) {
    toast.info('Please login to the system.', {
      position: "top-center",
      autoClose: 2000,
      style: {
        backgroundColor: '#FFA500', // Orange theme
        color: '#fff',
        fontWeight: 'bold',
      },
      icon: '⚠️',
    });
    toastShown.current = true; // Mark the toast as shown
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
