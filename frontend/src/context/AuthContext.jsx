import React, { useState, useCallback, useEffect, useRef } from "react";
import authService from "@/services/authService";
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

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await authService.logout();
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Erro ao fazer logout no backend:", error);
      }
    }
  }, []);

  const updateUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        throw { ...error, silent: true };
      }

      if (!error.silent) {
        console.error("Erro ao carregar dados do usuário:", error);
        setError("Erro ao carregar dados do usuário");
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;

    const loadUserOnMount = async () => {
      hasInitialized.current = true;

      const isLoginPage = window.location.pathname.includes("/login");
      const isRecoverPasswordPage =
        window.location.pathname.includes("/rec_senha");

      if (isLoginPage || isRecoverPasswordPage) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        await updateUser();
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.silent
        ) {
          setUser(null);
        } else {
          console.error("Erro na inicialização:", error);
        }
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

      await authService.login(email, senha);

      const userData = await authService.getMe();
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
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
    setIsLoading(true);
    try {
      return await updateUser(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const validateToken = useCallback(async () => {
    try {
      await authService.getMe();
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await logout();
      }
      return false;
    }
  }, [logout]);

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
