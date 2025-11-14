import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Table from '../components/data/Table';
import SearchBar from '../components/forms/SearchBar';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/formatDate';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers({
        page: currentPage,
        limit: 10,
        search,
      });
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await userApi.toggleUserStatus(userId);
      if (response.success) {
        setUsers(prev =>
          prev.map(u => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await userApi.deleteUser(userId);
      if (response.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (role) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          role === 'admin' ? 'bg-purple-100 text-purple-800' :
          role === 'agent' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {role}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (date) => formatDate(date, 'PP'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus(user._id, user.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              user.isActive
                ? 'bg-red-100 hover:bg-red-200 text-red-600'
                : 'bg-green-100 hover:bg-green-200 text-green-600'
            }`}
            title={user.isActive ? 'Deactivate user' : 'Activate user'}
          >
            {user.isActive ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleDeleteUser(user._id, user.name)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage all registered users
        </p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search users..." />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Table columns={columns} data={users} />
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Users;
