import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, MessageSquare, TrendingUp, Clock, Mail } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import Loader from '../components/common/Loader';
import ChartCard from '../components/data/ChartCard';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatDate } from '../utils/formatDate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardApi.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Properties',
      value: stats?.overview?.totalProperties || 0,
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Total Inquiries',
      value: stats?.overview?.totalInquiries || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Inquiries',
      value: stats?.overview?.pendingInquiries || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const userGrowthData = {
    labels: stats?.userGrowth?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats?.userGrowth?.map(item => item.count) || [],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const propertyStatsData = {
    labels: stats?.propertyStats?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Properties',
        data: stats?.propertyStats?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="User Growth (Last 12 Months)">
          <div className="h-64">
            <Line
              data={userGrowthData}
              options={{
                responsive: true,
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
        </ChartCard>

        <ChartCard title="Properties by Status">
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={propertyStatsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Recent Properties">
          <div className="space-y-3">
            {stats?.recentProperties?.slice(0, 5).map((property) => (
              <div
                key={property._id}
                onClick={() => navigate(`/properties/edit/${property._id}`)}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {property.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${property.price?.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                  property.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  property.status === 'sold' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
            {(!stats?.recentProperties || stats.recentProperties.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent properties
              </p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Recent Users">
          <div className="space-y-3">
            {stats?.recentUsers?.slice(0, 5).map((user) => (
              <div
                key={user._id}
                onClick={() => navigate('/users')}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  user.role === 'agent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent users
              </p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Recent Inquiries">
          <div className="space-y-3">
            {stats?.recentInquiries?.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry._id}
                onClick={() => navigate('/inquiries')}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {inquiry.user?.name || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {inquiry.property?.title || 'No property'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    inquiry.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {inquiry.status}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(inquiry.createdAt, 'PP')}
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentInquiries || stats.recentInquiries.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent inquiries
              </p>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
