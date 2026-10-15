import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:8000';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tamil_buddy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API error caught:', error?.message);
    return Promise.reject(error);
  }
);
