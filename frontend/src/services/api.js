import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createUser: (data) => api.post('/admin/users', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createStore: (data) => api.post('/admin/stores', data),
  getStores: (params) => api.get('/admin/stores', { params })
};

// User APIs
export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  submitRating: (data) => api.post('/user/ratings', data),
  getUserRating: (storeId) => api.get(`/user/ratings/${storeId}`)
};

// Store Owner APIs
export const storeOwnerAPI = {
  getDashboard: () => api.get('/store-owner/dashboard')
};

export default api;
