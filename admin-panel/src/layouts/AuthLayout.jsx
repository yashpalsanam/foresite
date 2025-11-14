// src/layouts/AuthLayout.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <img 
            src="/assets/logo.png" 
            alt="Foresite" 
            className="h-12 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-gray-800">Foresite Admin</h1>
          <p className="text-gray-600 mt-2">Property Management Dashboard</p>
        </div>

        {/* Auth Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>&copy; 2025 Foresite. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;