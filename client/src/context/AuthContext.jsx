import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'));
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  // Load user profile on app load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.data.success) {
          setUser(res.data.data);
          localStorage.setItem('cc_user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.warn('Session expired or invalid token');
        logout(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const handleAuthSuccess = (data, welcomeMsg) => {
    localStorage.setItem('cc_token', data.token);
    localStorage.setItem('cc_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    if (welcomeMsg) success(welcomeMsg);
  };

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      handleAuthSuccess(res.data, `Welcome back, ${res.data.user.name}!`);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      error(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      handleAuthSuccess(res.data, `Welcome to CampusConnect, ${res.data.user.name}!`);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      error(msg);
      throw new Error(msg);
    }
  };

  const demoLogin = async (role) => {
    try {
      const res = await authApi.demoLogin(role);
      handleAuthSuccess(res.data, `Switched to ${res.data.user.name} (${res.data.user.role})`);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login failed.';
      error(msg);
      throw new Error(msg);
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
    if (notify) success('You have been logged out.');
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('cc_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
