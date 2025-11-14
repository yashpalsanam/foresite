import { useState, useEffect } from 'react';
import { inquiryApi } from '../api/inquiryApi';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Table from '../components/data/Table';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/formatDate';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getAllInquiries({
        page: currentPage,
        limit: 10,
      });
      if (response.success) {
        setInquiries(response.data.inquiries);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      const response = await inquiryApi.updateInquiry(inquiryId, { status: newStatus });
      if (response.success) {
        setInquiries(prev =>
          prev.map(inq => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
        alert(`Inquiry marked as ${newStatus}`);
      }
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
      alert(error.response?.data?.message || 'Failed to update inquiry status');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'property',
      label: 'Property',
      render: (property) => property?.title || 'N/A',
    },
    {
      key: 'inquiryType',
      label: 'Type',
      render: (type) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
          {type}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (date) => formatDate(date, 'PP'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, inquiry) => (
        <div className="flex gap-2">
          {inquiry.status !== 'pending' && (
            <button
              onClick={() => handleUpdateStatus(inquiry._id, 'pending')}
              className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg transition-colors"
              title="Mark as pending"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}
          {inquiry.status !== 'completed' && (
            <button
              onClick={() => handleUpdateStatus(inquiry._id, 'completed')}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
              title="Mark as completed"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {inquiry.status !== 'cancelled' && (
            <button
              onClick={() => handleUpdateStatus(inquiry._id, 'cancelled')}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
              title="Mark as cancelled"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage customer inquiries
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Table columns={columns} data={inquiries} />
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

export default Inquiries;
