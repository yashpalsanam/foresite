import axiosInstance from './axiosInstance';

export const propertyApi = {
  getAllProperties: async (params = {}) => {
    const response = await axiosInstance.get('/properties', { params });
    return response.data;
  },

  getPropertyById: async (id) => {
    const response = await axiosInstance.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await axiosInstance.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await axiosInstance.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await axiosInstance.delete(`/properties/${id}`);
    return response.data;
  },

  uploadImages: async (id, formData) => {
    const response = await axiosInstance.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteImage: async (propertyId, imageId) => {
    const response = await axiosInstance.delete(`/properties/${propertyId}/images/${imageId}`);
    return response.data;
  },

  getFeaturedProperties: async () => {
    const response = await axiosInstance.get('/properties/featured');
    return response.data;
  },

  getNearbyProperties: async (lng, lat, maxDistance) => {
    const response = await axiosInstance.get('/properties/nearby', {
      params: { lng, lat, maxDistance },
    });
    return response.data;
  },

  getPropertyStats: async () => {
    const response = await axiosInstance.get('/properties/stats');
    return response.data;
  },
};

export default propertyApi;
