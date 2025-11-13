// src/router/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import BlankLayout from '../layouts/BlankLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Properties from '../pages/Properties';
import AddProperty from '../pages/AddProperty';
import Users from '../pages/Users';
import Inquiries from '../pages/Inquiries';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Analytics from '../pages/Analytics';
import AuditLogs from '../pages/AuditLogs';
import Error404 from '../pages/Error404';

// Protected Route Component
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Redirect root based on auth status */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Auth Routes (Public) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/add" element={<AddProperty />} />
        <Route path="/properties/edit/:id" element={<AddProperty />} />
        <Route path="/users" element={<Users />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
      </Route>

      {/* 404 Page */}
      <Route element={<BlankLayout />}>
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;