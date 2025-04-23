import axios from 'axios';

// Get the API URL from environment variables, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // Increased timeout for production
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Request Config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response received:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    
    // If unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Only log detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Response error:', error.response || error);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
