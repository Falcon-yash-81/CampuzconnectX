import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid
      if (localStorage.getItem('cc_token')) {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
};

// Users & Profile endpoints
export const userApi = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updateSkills: (data) => api.put('/users/skills', data),
  getSkillExchanges: () => api.get('/users/skill-exchanges'),
};

// Help Requests endpoints
export const helpApi = {
  create: (data) => api.post('/help', data),
  getAll: (params) => api.get('/help', { params }),
  getMyRequests: () => api.get('/help/user/my-requests'),
  getById: (id) => api.get(`/help/${id}`),
  update: (id, data) => api.put(`/help/${id}`, data),
  delete: (id) => api.delete(`/help/${id}`),
  getMatches: (id) => api.get(`/help/${id}/matches`),
};

// Connections endpoints
export const connectionApi = {
  create: (data) => api.post('/connections', data),
  getAll: (params) => api.get('/connections', { params }),
  updateStatus: (id, status) => api.put(`/connections/${id}`, { status }),
  complete: (id, data) => api.post(`/connections/${id}/complete`, data),
};

// Campus Issues endpoints
export const issueApi = {
  create: (data) => api.post('/issues', data),
  getAll: (params) => api.get('/issues', { params }),
  getMyReports: () => api.get('/issues/user/my-reports'),
  getById: (id) => api.get(`/issues/${id}`),
  update: (id, data) => api.put(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
};

// Admin endpoints
export const adminApi = {
  getStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  updateIssue: (id, data) => api.put(`/admin/issues/${id}`, data),
};

export default api;
