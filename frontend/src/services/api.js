/**
 * API Service - Base axios configuration
 * 
 * Provides centralized HTTP client with:
 * - Base URL configuration
 * - Token authentication
 * - Request/response interceptors
 * - Error handling
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        
        case 422:
          // Validation errors - return them for form handling
          break;
        
        case 403:
          console.error('Access forbidden');
          break;
        
        case 404:
          console.error('Resource not found');
          break;
        
        case 500:
          console.error('Server error');
          break;
      }

      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response from server');
      return Promise.reject(new Error('Network error'));
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
