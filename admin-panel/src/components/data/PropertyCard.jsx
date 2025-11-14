import { MapPin, Bed, Bath, Maximize, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const PropertyCard = ({ property, onClick, onDelete }) => {
  const primaryImage = property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(property);
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(property)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={primaryImage || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            property.status === 'available' ? 'bg-green-500 text-white' :
            property.status === 'sold' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {property.status}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-2 left-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            title="Delete property"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {property.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">
            {property.address?.city}, {property.address?.state}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          {property.features?.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.features.bedrooms}
            </div>
          )}
          {property.features?.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.features.bathrooms}
            </div>
          )}
          {property.features?.area && (
            <div className="flex items-center">
              <Maximize className="w-4 h-4 mr-1" />
              {property.features.area} {property.features.areaUnit}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${property.price?.toLocaleString()}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(property.createdAt, 'PP')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
