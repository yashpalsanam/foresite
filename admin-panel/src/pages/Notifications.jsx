import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { Bell, Check } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatDistanceDate } from '../utils/formatDate';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getAllNotifications();
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {notifications.filter(n => !n.isRead).length} unread notifications
          </p>
        </div>
        <Button variant="secondary" onClick={handleMarkAllAsRead}>
          <Check className="w-5 h-5 mr-2" />
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${
              !notification.isRead ? 'border-l-4 border-primary-600' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatDistanceDate(notification.createdAt)}
                  </p>
                </div>
              </div>
              {!notification.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
