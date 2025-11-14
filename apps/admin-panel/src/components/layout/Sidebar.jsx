import { NavLink } from 'react-router-dom';
import { Home, Building2, Users, MessageSquare, Bell, Settings, BarChart3, FileText, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { isAdmin } from '../../utils/permissionUtils';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUI();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'agent'] },
    { path: '/properties', icon: Building2, label: 'Properties', roles: ['admin', 'agent'] },
    { path: '/users', icon: Users, label: 'Users', roles: ['admin'] },
    { path: '/inquiries', icon: MessageSquare, label: 'Inquiries', roles: ['admin', 'agent'] },
    { path: '/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'agent'] },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin'] },
    { path: '/audit-logs', icon: FileText, label: 'Audit Logs', roles: ['admin'] },
    { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'agent'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Foresite Admin
          </h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
