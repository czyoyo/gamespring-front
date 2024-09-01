import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // authorization 헤더 설정
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getUsers: () => api.get('/chat/users'),
  getUser: () => api.get(`/auth/current-user`),
  getMessages: (roomId) => api.get(`/chat/messages/${roomId}`),
};
