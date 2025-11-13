import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { propertyApi } from '../api/propertyApi';
import Button from '../components/common/Button';
import SearchBar from '../components/forms/SearchBar';
import PropertyCard from '../components/data/PropertyCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [currentPage, search]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAllProperties({
        page: currentPage,
        limit: 12,
        search,
      });
      if (response.success) {
        setProperties(response.data.properties);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all property listings
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/properties/add')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search properties..."
        />
      </div>

      {loading ? (
        <Loader fullScreen />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={(prop) => navigate(`/properties/edit/${prop._id}`)}
              />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No properties found</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
