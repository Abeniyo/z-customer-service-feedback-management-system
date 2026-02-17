import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/accounts/login/', {
        username,
        password
      });

      console.log('Login response:', response.data); // Debug log

      // Handle different response structures
      const access = response.data.access || response.data.token;
      const refresh = response.data.refresh;
      
      // Get user data from response (adjust based on your API response)
      const userData = response.data.user || {
        username: username,
        role: response.data.role || 'callcenter', // Get role from response
        email: response.data.email || '',
      };

      // Store tokens
      if (access) localStorage.setItem('accessToken', access);
      if (refresh) localStorage.setItem('refreshToken', refresh);

      // Store user
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.response?.data?.detail ||
                          'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};