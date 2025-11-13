import { useEffect, useState } from 'react';
import { Users, Building2, MessageSquare, TrendingUp } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import Loader from '../components/common/Loader';
import ChartCard from '../components/data/ChartCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
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

  const chartData = {
    labels: stats?.userGrowth?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'User Growth',
        data: stats?.userGrowth?.map(item => item.count) || [],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
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
        <ChartCard title="User Growth">
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>

        <ChartCard title="Recent Properties">
          <div className="space-y-3">
            {stats?.recentProperties?.slice(0, 5).map((property) => (
              <div
                key={property._id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {property.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${property.price?.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
