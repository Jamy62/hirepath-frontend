import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from 'axios';
import DefaultProfile from 'src/assets/images/profile/profile.jpg';

const AuthContext = createContext(undefined);

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/v1'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('imageUrl'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
    if (user) {
      localStorage.setItem('user', user);
    }
    if (imageUrl) {
      localStorage.setItem('imageUrl', imageUrl);
    }
    else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token, user, imageUrl]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      const token = response.data.data.token;
      const user = response.data.data.user;

      if (token && user) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (user.profile) {
          try {
            const response = await apiClient.get(`/files/download/images/${user.profile}`, {
              responseType: 'blob',
            });

            const tempUrl = URL.createObjectURL(response.data);
            setImageUrl(tempUrl);
          } catch (e) {
            console.log("Failed to fetch user profile image:", e, ". Default profile used");
            setImageUrl(DefaultProfile);
          }
        }
        else {
          setImageUrl(DefaultProfile);
        }

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
  }, []);

  const register = useCallback(async (name, email, fullName, password) => {
    try {
      await apiClient.post('/user/register', {
        email,
        password,
        name,
        fullName
      });
    } catch (e) {
      console.error('Registration Api failed', e);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.post('/auth/logout').catch(err => {
      console.log("Logout API call failed:", err.message);
    });

    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Token invalid or expired");
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, imageUrl, token, apiClient, login, register, logout }}>
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