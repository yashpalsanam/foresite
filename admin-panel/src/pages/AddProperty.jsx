import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { propertyApi } from '../api/propertyApi';
import FormInput from '../components/forms/FormInput';
import SelectInput from '../components/forms/SelectInput';
import FileUploader from '../components/forms/FileUploader';
import Button from '../components/common/Button';
import { PROPERTY_TYPES, PROPERTY_STATUS, LISTING_TYPES } from '../utils/constants';
import toast from 'react-hot-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    status: 'available',
    listingType: 'sale',
    price: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    location: {
      coordinates: ['', ''],
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sqft',
    },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyApi.getPropertyById(id);
      if (response.success) {
        const property = response.data.property;
        setFormData({
          ...property,
          location: {
            coordinates: property.location?.coordinates || ['', ''],
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          location: {
            coordinates: [longitude, latitude],
          },
        });
        toast.success('Location captured successfully!');
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please enter coordinates manually.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const geocodeFromAddress = async () => {
    const { street, city, state, zipCode } = formData.address;
    
    if (!street || !city || !state) {
      toast.error('Please fill in street, city, and state first');
      return;
    }

    setGettingLocation(true);
    
    try {
      const address = `${street}, ${city}, ${state} ${zipCode}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'Foresite-Admin/1.0',
          },
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData({
          ...formData,
          location: {
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
        });
        toast.success('Address geocoded successfully!');
      } else {
        toast.error('Could not find coordinates for this address');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to geocode address');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'location' && child === 'coordinates') {
        // Handle coordinate input separately
        return;
      }
      
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCoordinateChange = (index, value) => {
    const newCoordinates = [...formData.location.coordinates];
    newCoordinates[index] = value === '' ? '' : parseFloat(value) || 0;
    setFormData({
      ...formData,
      location: {
        coordinates: newCoordinates,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isEdit
        ? await propertyApi.updateProperty(id, formData)
        : await propertyApi.createProperty(formData);

      if (response.success) {
        if (images.length > 0 && response.data.property._id) {
          const formDataImages = new FormData();
          images.forEach((image) => {
            formDataImages.append('files', image);
          });
          await propertyApi.uploadImages(response.data.property._id, formDataImages);
        }

        toast.success(isEdit ? 'Property updated!' : 'Property created!');
        navigate('/properties');
      }
    } catch (error) {
      console.error('Failed to save property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <SelectInput
            label="Property Type"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            options={PROPERTY_TYPES}
            required
          />

          <SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={PROPERTY_STATUS}
            required
          />

          <SelectInput
            label="Listing Type"
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            options={LISTING_TYPES}
            required
          />

          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Bedrooms"
            name="features.bedrooms"
            type="number"
            value={formData.features.bedrooms}
            onChange={handleChange}
          />

          <FormInput
            label="Bathrooms"
            name="features.bathrooms"
            type="number"
            value={formData.features.bathrooms}
            onChange={handleChange}
          />

          <FormInput
            label="Area (sqft)"
            name="features.area"
            type="number"
            value={formData.features.area}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
            <FormInput
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
            />
            <FormInput
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
            />
            <FormInput
              label="ZIP Code"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>
          
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant="secondary"
              onClick={getCurrentLocation}
              loading={gettingLocation}
              disabled={gettingLocation}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={geocodeFromAddress}
              loading={gettingLocation}
              disabled={gettingLocation}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get From Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location.coordinates[0]}
                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                placeholder="e.g., -73.935242"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location.coordinates[1]}
                onChange={(e) => handleCoordinateChange(1, e.target.value)}
                placeholder="e.g., 40.730610"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {formData.location.coordinates[0] && formData.location.coordinates[1] && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📍 Coordinates: {formData.location.coordinates[1]}, {formData.location.coordinates[0]}
                <br />
                <a
                  href={`https://www.google.com/maps?q=${formData.location.coordinates[1]},${formData.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  View on Google Maps →
                </a>
              </p>
            </div>
          )}
        </div>

        {!isEdit && (
          <div className="mt-6">
            <FileUploader
              label="Property Images"
              name="images"
              onChange={setImages}
              multiple
              accept="image/*"
            />
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Update Property' : 'Create Property'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/properties')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;