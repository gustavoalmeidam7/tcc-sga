import axios from "axios";
import { getAuthToken } from "./tokenStore.js";

const API_URL = __DEV__
  ? "http://127.0.0.1:8000"
  : "https://tcc-sga.onrender.com";

let onTokenExpiredCallback = null;

export const setOnTokenExpired = (callback) => {
  onTokenExpiredCallback = callback;
};

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_ROUTES = ["/token/", "/token/refresh-token/", "/token/logout/"];
API.interceptors.request.use(
  async (config) => {
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      config.url?.includes(route)
    );

    if (!isAuthRoute) {
      const token = await getAuthToken();
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
        message: "Erro de conexão. Verifique sua internet ou o servidor.",
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
      if (typeof data.detail === "object") {
        const details = Array.isArray(data.detail)
          ? data.detail
          : [data.detail];
        errorMessage = details
          .map((d) => d.msg || JSON.stringify(d))
          .join(", ");
      } else {
        errorMessage = data.detail;
      }
    }

    if (status === 401) {
      if (error.config?.url?.includes("/token")) {
        return Promise.reject({
          ...error,
          message: errorMessage || "Credenciais inválidas",
        });
      }

      if (originalRequest._retry) {
        if (onTokenExpiredCallback) {
          onTokenExpiredCallback();
        }
        return Promise.reject({
          ...error,
          message: "Sua sessão expirou. Faça login novamente.",
        });
      }

      originalRequest._retry = true;

      try {
        await API.post("/token/refresh-token/");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("❌ Erro ao fazer refresh do token:", refreshError);
        if (onTokenExpiredCallback) {
          onTokenExpiredCallback();
        }
        return Promise.reject({
          ...error,
          message: "Sua sessão expirou. Faça login novamente.",
        });
      }
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
