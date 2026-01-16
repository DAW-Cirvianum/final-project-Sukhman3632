/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls:
 * - Register new user
 * - Login
 * - Logout
 * - Get current user info
 */

import api from './api';

const authService = {
  /**
   * Register a new user
   */
  async register(data) {
    const response = await api.post('/auth/register', data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user
   */
  async getMe() {
    const response = await api.get('/auth/me');
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get stored user
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
