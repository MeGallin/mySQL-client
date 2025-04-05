import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { User, AuthContextType, AuthResponse } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize axios defaults
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // Add request interceptor for adding auth token
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Request failed';
      console.error('Request interceptor error:', error);
      setError(errorMessage);
      return Promise.reject(new Error(errorMessage));
    },
  );

  // Add response interceptor for token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // If request has already been retried, reject
      if (originalRequest._retry) {
        const errorMessage =
          (error as AxiosError<{ message: string }>)?.response?.data?.message ||
          'Request failed';
        console.error('Response interceptor error:', error);
        setError(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      // If error is not 401, reject with error message
      if (error.response?.status !== 401) {
        const errorMessage =
          (error as AxiosError<{ message: string }>)?.response?.data?.message ||
          'Request failed';
        console.error('Response interceptor error:', error);
        setError(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post<AuthResponse>('/auth/refresh');
        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axios(originalRequest);
      } catch (err) {
        // If refresh fails, log out the user
        const errorMessage =
          (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          'Session expired';
        console.error('Token refresh error:', err);
        setError(errorMessage);
        logout();
        return Promise.reject(new Error(errorMessage));
      }
    },
  );

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const response = await axios.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      const { user, accessToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(user);

      return user;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'An error occurred during login';
      console.error('Login error:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<User> => {
    try {
      setError(null);
      const response = await axios.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
      });
      const { user, accessToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(user);

      return user;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'An error occurred during registration';
      console.error('Registration error:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'An error occurred during logout';
      console.error('Logout error:', err);
      setError(errorMessage);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.post<AuthResponse>('/auth/refresh');
      const { user, accessToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(user);
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Session expired';
      console.error('Auth check error:', err);
      setError(errorMessage);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
