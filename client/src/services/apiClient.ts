import axios, { InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.machquanho.com/api',
  timeout: 15000, // 15 seconds timeout per queued request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Concurrency queue to prevent Shared Hosting (LiteSpeed / PHP-FPM) connection throttling when loading page
const MAX_CONCURRENT_REQUESTS = 2;
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

const nextRequest = () => {
  if (activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
    const next = requestQueue.shift();
    if (next) {
      activeRequests++;
      next();
    }
  }
};

// Request interceptor: Attach JWT token and enqueue request if max concurrency reached
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('mqh_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve) => {
    const executeRequest = () => resolve(config);
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      activeRequests++;
      executeRequest();
    } else {
      requestQueue.push(executeRequest);
    }
  });
});

// Response interceptor: Release slot and trigger next queued request
apiClient.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    nextRequest();
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    nextRequest();
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mqh_jwt_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

