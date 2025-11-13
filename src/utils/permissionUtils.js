import { USER_ROLES } from './constants';

export const hasPermission = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

export const isAgent = (user) => {
  return user?.role === USER_ROLES.AGENT;
};

export const isAdminOrAgent = (user) => {
  return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.AGENT;
};

export const canEditProperty = (user, property) => {
  if (isAdmin(user)) return true;
  if (isAgent(user) && property.owner === user._id) return true;
  return false;
};

export const canDeleteProperty = (user, property) => {
  if (isAdmin(user)) return true;
  if (isAgent(user) && property.owner === user._id) return true;
  return false;
};

export const canManageUsers = (user) => {
  return isAdmin(user);
};

export const canViewAnalytics = (user) => {
  return isAdminOrAgent(user);
};
