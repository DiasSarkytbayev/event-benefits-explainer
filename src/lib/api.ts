import axios from 'axios';

// Backend API URL - should NOT include /api suffix
const BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.MODE === 'production' 
    ? 'https://event-benefits-explainer-4.onrender.com'
    : 'http://localhost:5000');
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Events API
export const eventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  register: (id: string) => api.post(`/events/${id}/register`),
  unregister: (id: string) => api.delete(`/events/${id}/unregister`),
  checkRegistration: (id: string) => api.get(`/events/${id}/check-registration`),
  getRegistrations: (id: string) => api.get(`/events/${id}/registrations`),
};

// AI Analysis API
export const aiAPI = {
  analyzeEvent: (eventId: string) => api.post(`/ai-analysis/${eventId}`),
};

export default api;
