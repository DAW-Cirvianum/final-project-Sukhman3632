import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext.js';
import authService from '../services/authService';
import { useNotification } from '../hooks/useNotification';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  //check if user is already logged
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const storedUser = authService.getUser();

      if (token && storedUser) {
        try {
          // Verify token i valid
          const data = await authService.getMe();
          setUser(data.user);
        } catch {
          // Token invalid
          authService.logout();
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      showSuccess('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      showError(message);
      return { success: false, error: message };
    }
  }, [showSuccess, showError]);

  const register = useCallback(async (data) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      showSuccess('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || {};
      showError(message);
      return { success: false, error: message, errors };
    }
  }, [showSuccess, showError]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      showSuccess('Logged out successfully');
    } catch {
      showError('Logout failed');
    }
  }, [showSuccess, showError]);

  const isAuthenticated = useCallback(() => {
    return !!user && !!authService.getToken();
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
