import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { Activity, User, Building2, MessageSquare, Clock } from 'lucide-react';
import Loader from '../components/common/Loader';
import Table from '../components/data/Table';
import { formatDate } from '../utils/formatDate';

const AuditLogs = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const activityLogs = [];

  stats?.recentUsers?.forEach(user => {
    activityLogs.push({
      id: `user-${user._id}`,
      type: 'User Registration',
      description: `${user.name} (${user.role}) joined the platform`,
      timestamp: user.createdAt,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    });
  });

  stats?.recentProperties?.forEach(property => {
    activityLogs.push({
      id: `property-${property._id}`,
      type: 'Property Added',
      description: `New property "${property.title}" listed for ${property.listingType}`,
      timestamp: property.createdAt,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    });
  });

  stats?.recentInquiries?.forEach(inquiry => {
    activityLogs.push({
      id: `inquiry-${inquiry._id}`,
      type: 'Inquiry Received',
      description: `${inquiry.user?.name || 'User'} inquired about ${inquiry.property?.title || 'a property'}`,
      timestamp: inquiry.createdAt,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    });
  });

  activityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const columns = [
    {
      key: 'icon',
      label: 'Type',
      render: (_, row) => {
        const Icon = row.icon;
        return (
          <div className={`p-2 rounded-lg ${row.bgColor} inline-flex`}>
            <Icon className={`w-5 h-5 ${row.color}`} />
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Activity',
      render: (type) => (
        <span className="font-medium text-gray-900 dark:text-white">{type}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (description) => (
        <span className="text-gray-600 dark:text-gray-400">{description}</span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (timestamp) => (
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {formatDate(timestamp, 'PPp')}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Recent system activity and audit trails
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {activityLogs.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">User Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.recentUsers?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Property Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.recentProperties?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity Log
          </h2>
        </div>
        <Table columns={columns} data={activityLogs} />
      </div>

      {activityLogs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-6">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity found</p>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
