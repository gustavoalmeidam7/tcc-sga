import axios from 'axios';
import { getAuthToken, clearAuthToken } from './tokenStore';

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Erro de conexão. Verifique sua internet.',
        isNetworkError: true
      });
    }

    const { status } = error.response;

    if (status === 401) {
      clearAuthToken();

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }

      return Promise.reject({
        ...error,
        message: 'Sua sessão expirou. Faça login novamente.'
      });
    }

    if (status === 403) {
      return Promise.reject({
        ...error,
        message: 'Você não tem permissão'
      });
    }

    if (status === 404) {
      return Promise.reject({
        ...error,
        message: 'não encontrado.'
      });
    }

    if (status >= 500) {
      return Promise.reject({
        ...error,
        message: 'Erro no servidor, tente novamente.'
      });
    }

    return Promise.reject(error);
  }
);

export default API;