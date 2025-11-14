import { useEffect, useState } from 'react';
import { Users, Building2, MessageSquare, TrendingUp, Activity, Monitor } from 'lucide-react';
import { analyticsApi } from '../api/analyticsApi';
import Loader from '../components/common/Loader';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [propertyStats, setPropertyStats] = useState(null);
  const [inquiryStats, setInquiryStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [users, properties, inquiries, analytics] = await Promise.all([
        analyticsApi.getUserStats().catch(err => ({ success: false })),
        analyticsApi.getPropertyStats().catch(err => ({ success: false })),
        analyticsApi.getInquiryStats().catch(err => ({ success: false })),
        analyticsApi.getAnalytics().catch(err => ({ success: false })),
      ]);

      if (users.success) setUserStats(users.data);
      if (properties.success) setPropertyStats(properties.data);
      if (inquiries.success) setInquiryStats(inquiries.data);
      if (analytics.success) setAnalyticsData(analytics.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const usersByRoleData = {
    labels: userStats?.usersByRole?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Users by Role',
        data: userStats?.usersByRole?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
      },
    ],
  };

  const propertyByStatusData = {
    labels: ['Available', 'Sold', 'Rented'],
    datasets: [
      {
        label: 'Properties by Status',
        data: [
          propertyStats?.availableProperties || 0,
          propertyStats?.soldProperties || 0,
          propertyStats?.rentedProperties || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };

  const inquiryTypeData = {
    labels: inquiryStats?.inquiriesByType?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Inquiries by Type',
        data: inquiryStats?.inquiriesByType?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
      },
    ],
  };

  const deviceStatsData = {
    labels: analyticsData?.deviceStats?.map(item => item._id || 'Unknown') || [],
    datasets: [
      {
        label: 'Device Usage',
        data: analyticsData?.deviceStats?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(244, 114, 182, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
      },
    ],
  };

  const statCards = [
    {
      title: 'Total Users',
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      subtext: `${userStats?.activeUsers || 0} active`,
    },
    {
      title: 'Total Properties',
      value: propertyStats?.totalProperties || 0,
      icon: Building2,
      color: 'bg-green-500',
      subtext: `${propertyStats?.availableProperties || 0} available`,
    },
    {
      title: 'Total Inquiries',
      value: inquiryStats?.totalInquiries || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      subtext: `${inquiryStats?.pendingInquiries || 0} pending`,
    },
    {
      title: 'Avg Response Time',
      value: `${inquiryStats?.averageResponseTimeHours || 0}h`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      subtext: 'Average response',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive analytics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Users by Role
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={usersByRoleData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Properties by Status
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={propertyByStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inquiries by Type
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Bar
              data={inquiryTypeData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Device Usage
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={deviceStatsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Users</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userStats?.totalUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-semibold text-green-600">
                {userStats?.activeUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Inactive Users</span>
              <span className="font-semibold text-red-600">
                {userStats?.inactiveUsers || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inquiry Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Inquiries</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {inquiryStats?.totalInquiries || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
              <span className="font-semibold text-yellow-600">
                {inquiryStats?.pendingInquiries || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="font-semibold text-green-600">
                {inquiryStats?.completedInquiries || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
              <span className="font-semibold text-red-600">
                {inquiryStats?.cancelledInquiries || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
