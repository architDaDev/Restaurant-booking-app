import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);


const API = axios.create({
  baseURL: 'http://localhost:5080/api/v1/auth',
  withCredentials: true, // Crucial for HttpOnly cookie exchange
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // We will create a small /me endpoint in the backend later if needed, 
        // but for now, we can hit login with empty data or a dedicated check route.
        // For standard state persistence, we try to load a saved session flag or verify with backend.
        const localUser = localStorage.getItem('app_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } catch (err) {
        console.error("Auth persistence check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // 2. Login Action
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/login', { email, password });
      if (response.data.status === 'success') {
        setUser(response.data.user);
        localStorage.setItem('app_user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // 3. Register Action
  const register = async (name, email, password, role, phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/register', { name, email, password, role, phoneNumber });
      if (response.data.status === 'success') {
        setUser(response.data.user);
        localStorage.setItem('app_user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // 4. Logout Action
  const logout = async () => {
    setLoading(true);
    try {
      await API.get('/logout');
      setUser(null);
      localStorage.removeItem('app_user');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};