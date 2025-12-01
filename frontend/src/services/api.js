import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    const originalRequest = error.config;

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
      const isLoginRequest = originalRequest?.url?.includes("/token");
      const isRefreshRequest = originalRequest?.url?.includes("/refresh-token");
      const isLoginPage = window.location.pathname.includes("/login");
      const isRecoverPasswordPage =
        window.location.pathname.includes("/rec_senha");
      const isPublicPage = isLoginPage || isRecoverPasswordPage;

      // Não tenta refresh em requisições de login ou páginas públicas
      if (isLoginRequest) {
        return Promise.reject({
          ...error,
          silent: true,
        });
      }

      if (isPublicPage) {
        return Promise.reject({
          ...error,
          message: "Não autenticado",
          silent: true,
        });
      }

      if (isRefreshRequest) {
        isRefreshing = false;
        processQueue(error, null);
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return Promise.reject({
          ...error,
          message: "Sua sessão expirou. Faça login novamente.",
          silent: true,
        });
      }

      if (originalRequest._retry) {
        return Promise.reject({
          ...error,
          message: "Sua sessão expirou. Faça login novamente.",
        });
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        await authService.refreshToken();
        processQueue(null);
        isRefreshing = false;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));

        return Promise.reject({
          ...error,
          message: "Sua sessão expirou. Faça login novamente.",
          silent: refreshError.response?.status === 401,
        });
      }
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
