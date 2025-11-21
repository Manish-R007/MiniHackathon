import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
};

export const issuesAPI = {
  create: (issueData) => api.post('/issues', issueData),
  getAll: (params = {}) => api.get('/issues', { params }),
  getMyIssues: () => api.get('/issues/my-issues'),
  getById: (id) => api.get(`/issues/${id}`),
  update: (id, updateData) => api.put(`/issues/${id}`, updateData),
  addComment: (id, comment) => api.post(`/issues/${id}/comments`, comment),
  getStats: () => api.get('/issues/stats'),
};

export default api;