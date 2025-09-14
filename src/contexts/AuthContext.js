import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext(undefined);

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/v1'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
    else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      const token = response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        setToken(token);
        setUser(user);
      }
      else {
        throw new Error('No token received');
      }
    } catch (e) {
      console.error('Login Api error', e);
      throw e;
    }
  });

  const register = useCallback(async (name, email, password) => {
    try {
      await apiClient.post('/auth/register', {
        email,
        password,
        name
      });
    } catch (e) {
      console.error('Registration Api failed', e);
      throw e;
    }
  });

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error('Logout Api failed', e);
    } finally {
      setUser(null);
      setToken(null);
    }
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, apiClient, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}