import React, { useState, useCallback, useEffect, useRef } from "react";
import authService from "@/services/authService";
import {
  setAuthToken,
  clearAuthToken,
  getAuthToken,
} from "@/services/tokenStore";
import { AuthContext } from "@/hooks/useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasInitialized = useRef(false);
  const loginInProgressRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    async (token) => {
      if (!token) return null;

      try {
        const userData = await authService.getMe();
        setUser(userData);
        setError(null);
        return userData;
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          setUser(null);
        }

        setError("Erro ao carregar dados do usuário");
        throw error;
      }
    },
    [logout]
  );

  useEffect(() => {
    if (hasInitialized.current) return;

    const loadUserOnMount = async () => {
      hasInitialized.current = true;
      setIsLoading(true);

      try {
        const token = getAuthToken();
        if (token) {
          await updateUser(token);
        }
      } catch (error) {
        console.error("Erro na inicialização:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserOnMount();
  }, [updateUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (email, senha) => {
    if (loginInProgressRef.current) {
      throw new Error("Login já em andamento");
    }

    loginInProgressRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
      }

      const response = await authService.login(email, senha);
      const { access_token } = response;

      if (!access_token) {
        throw new Error("Token não recebido do servidor");
      }

      setAuthToken(access_token);

      const userData = await authService.getMe();
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      clearAuthToken();
      setUser(null);

      const errorMessage =
        error.response?.data?.Erros?.[0] ||
        error.response?.data?.detail ||
        error.message ||
        "Erro ao fazer login";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      loginInProgressRef.current = false;
    }
  }, []);

  const register = useCallback(
    async (userData) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!userData.email || !userData.senha) {
          throw new Error("Dados obrigatórios não fornecidos");
        }

        await authService.register(userData);

        const loginResponse = await login(userData.email, userData.senha);

        return { success: true, user: loginResponse.user, autoLogin: true };
      } catch (error) {
        const errorMessage =
          error.response?.data?.Erros?.[0] ||
          error.response?.data?.detail ||
          error.message ||
          "Erro ao criar conta";

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return null;

    setIsLoading(true);
    try {
      return await updateUser(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const validateToken = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      await authService.getMe();
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthToken();
        setUser(null);
      }
      return false;
    }
  }, []);

  const updateUserContext = useCallback((updatedUserData) => {
    setUser(updatedUserData);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,

    login,
    logout,
    register,
    refreshUser,
    validateToken,
    clearError,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
