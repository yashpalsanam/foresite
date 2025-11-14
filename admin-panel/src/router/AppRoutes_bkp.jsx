import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
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

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;
