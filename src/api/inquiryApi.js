import axiosInstance from './axiosInstance';

export const inquiryApi = {
  getAllInquiries: async (params = {}) => {
    const response = await axiosInstance.get('/inquiries', { params });
    return response.data;
  },

  getInquiryById: async (id) => {
    const response = await axiosInstance.get(`/inquiries/${id}`);
    return response.data;
  },

  createInquiry: async (inquiryData) => {
    const response = await axiosInstance.post('/inquiries', inquiryData);
    return response.data;
  },

  updateInquiry: async (id, inquiryData) => {
    const response = await axiosInstance.put(`/inquiries/${id}`, inquiryData);
    return response.data;
  },

  deleteInquiry: async (id) => {
    const response = await axiosInstance.delete(`/inquiries/${id}`);
    return response.data;
  },

  getMyInquiries: async (params = {}) => {
    const response = await axiosInstance.get('/inquiries/my-inquiries', { params });
    return response.data;
  },

  getInquiryStats: async () => {
    const response = await axiosInstance.get('/inquiries/stats');
    return response.data;
  },
};

export default inquiryApi;
