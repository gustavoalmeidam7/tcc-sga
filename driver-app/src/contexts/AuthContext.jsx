import { useCallback, useEffect, useRef, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import authService from "../services/auth";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "../services/tokenStore";
import { setOnTokenExpired } from "../services/api";
import { ROLES } from "@/src/lib/roles";

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
    await clearAuthToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    async (token) => {
      if (!token) return null;

      try {
        const userData = await authService.getMe();

        if (userData.cargo !== ROLES.DRIVER) {
          await clearAuthToken();
          setUser(null);
          throw new Error(
            "Acesso negado. Este aplicativo é exclusivo para motoristas."
          );
        }

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
        const token = await getAuthToken();
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
    const handleTokenExpired = async () => {
      console.log("Token expirado detectado, fazendo logout...");
      await logout();
    };

    setOnTokenExpired(handleTokenExpired);

    return () => {
      setOnTokenExpired(null);
    };
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

      await setAuthToken(access_token);

      const userData = await authService.getMe();

      if (userData.cargo !== ROLES.DRIVER) {
        await clearAuthToken();
        setUser(null);
        throw new Error(
          "Acesso negado. Este aplicativo é exclusivo para motoristas."
        );
      }

      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      await clearAuthToken();
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

  const refreshUser = useCallback(async () => {
    const token = await getAuthToken();
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
    const token = await getAuthToken();
    if (!token) return false;

    try {
      await authService.getMe();
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await clearAuthToken();
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
    refreshUser,
    validateToken,
    clearError,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
