

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📡 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error Response:');
    console.error('  URL:', error.config?.url);
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    console.error('  Message:', error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  registerCustomer: (data) => api.post('/auth/register/customer', data),
  registerHost: (data) => api.post('/auth/register/host', data),
  loginCustomer: (data) => api.post('/auth/login/customer', data),
  loginHost: (data) => api.post('/auth/login/host', data),
  googleAuthCustomer: (data) => api.post('/auth/google/customer', data),
  googleAuthHost: (data) => api.post('/auth/google/host', data),
};

// Hotel API
export const hotelAPI = {
  search: (params) => api.get('/hotels/search', { params }),
  getAll: () => api.get('/hotels/all'),
  getDetails: (id) => api.get(`/hotels/${id}`),
  getHostHotels: () => api.get('/hotels/host/my-hotels'),
  getPlatformStats: () => api.get('/hotels/stats/platform'),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

// Room API
export const roomAPI = {
  getDetails: (id) => api.get(`/rooms/${id}`),
  checkAvailability: (id, params) => api.get(`/rooms/${id}/availability`, { params }),
  getByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getDetails: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getHostBookings: () => api.get('/bookings/host/all-bookings'),
};

// Customer API
export const customerAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  changePassword: (data) => api.put('/customers/change-password', data),
};

// Host API
export const hostAPI = {
  getProfile: () => api.get('/hosts/profile'),
  updateProfile: (data) => api.put('/hosts/profile', data),
  getDashboardStats: () => api.get('/hosts/dashboard/stats'),
};

// Review API
export const reviewAPI = {
  addReview: (data) => api.post('/reviews', data),
  getBookingReview: (bookingId) => api.get(`/reviews/booking/${bookingId}`),
};

export default api;
