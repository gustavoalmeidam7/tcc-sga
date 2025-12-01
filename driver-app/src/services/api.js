import axios from "axios";
import { clearAuthToken, getAuthToken } from "./tokenStore.js";

const API_URL = __DEV__
  ? "http://127.0.0.1:8000"
  : "https://tcc-sga.onrender.com";

let onTokenExpiredCallback = null;

export const setOnTokenExpired = (callback) => {
  onTokenExpiredCallback = callback;
};

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Erro de conexão. Verifique sua internet ou o servidor.",
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    const backendErrors = data?.Erros;
    let errorMessage = "Erro desconhecido";

    if (
      backendErrors &&
      Array.isArray(backendErrors) &&
      backendErrors.length > 0
    ) {
      errorMessage = backendErrors.join(", ");
    } else if (data?.detail) {
      errorMessage = data.detail;
    }

    if (status === 401) {
      if (error.config?.url?.includes("/token")) {
        return Promise.reject({
          ...error,
          message: errorMessage || "Credenciais inválidas",
        });
      }
      
      await clearAuthToken();
      if (onTokenExpiredCallback) {
        onTokenExpiredCallback();
      }
      return Promise.reject({
        ...error,
        message: "Sua sessão expirou. Faça login novamente.",
      });
    }

    if (status === 403) {
      return Promise.reject({
        ...error,
        message: errorMessage || "Você não tem permissão para esta ação.",
      });
    }

    if (status === 404) {
      return Promise.reject({
        ...error,
        message: errorMessage || "Recurso não encontrado.",
      });
    }

    if (status === 409) {
      return Promise.reject({
        ...error,
        message: errorMessage,
      });
    }

    if (status >= 500) {
      if (
        error.config?.url?.includes("/me") ||
        error.config?.url?.includes("/auth")
      ) {
        await clearAuthToken();
      }
      return Promise.reject({
        ...error,
        message: "Erro no servidor. Tente novamente mais tarde.",
      });
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

export default API;
