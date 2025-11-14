export const routeConfig = {
  public: [
    { path: '/login', name: 'Login' },
  ],
  protected: [
    { path: '/dashboard', name: 'Dashboard', roles: ['admin', 'agent'] },
    { path: '/properties', name: 'Properties', roles: ['admin', 'agent'] },
    { path: '/users', name: 'Users', roles: ['admin'] },
    { path: '/inquiries', name: 'Inquiries', roles: ['admin', 'agent'] },
    { path: '/notifications', name: 'Notifications', roles: ['admin', 'agent'] },
    { path: '/settings', name: 'Settings', roles: ['admin', 'agent'] },
    { path: '/analytics', name: 'Analytics', roles: ['admin'] },
    { path: '/audit-logs', name: 'Audit Logs', roles: ['admin'] },
  ],
};

export default routeConfig;
