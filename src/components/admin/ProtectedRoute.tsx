import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    initializeAuth: state.initializeAuth,
  }));

  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      initializeAuth();
    }
  }, [isAuthenticated, loading, initializeAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // ✅ Renders nested route content like AdminLayout
};

export default ProtectedRoute;
