import axios from 'axios';

export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mqh_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
