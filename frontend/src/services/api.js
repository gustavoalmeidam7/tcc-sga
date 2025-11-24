import axios from "axios";
import { getAuthToken, clearAuthToken } from "./tokenStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const isLoginRequest = config.url?.includes("/token");
    if (!isLoginRequest) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        message: "Erro de conexão. Verifique sua internet.",
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
      const isLoginRequest = error.config?.url?.includes("/token");

      if (isLoginRequest) {
        return Promise.reject(error);
      }

      clearAuthToken();
      const isLoginPage = window.location.pathname.includes("/login");
      if (!isLoginPage) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

      return Promise.reject({
        ...error,
        message: "Sua sessão expirou. Faça login novamente.",
      });
    }

    if (status === 403) {
      return Promise.reject({
        ...error,
        message:
          errorMessage || "Você não tem permissão para realizar esta ação",
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
