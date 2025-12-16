import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import authService from "../services/auth";
import { setOnTokenExpired } from "../services/api";
import { setAuthToken } from "../services/tokenStore";
import { ROLES } from "../lib/roles";

interface User {
  id: string | number;
  nome: string;
  email: string;
  cargo: string;
  [key: string]: any;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  login: (email: string, senha: string) => Promise<User | void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout failed on server", e);
    }
    await setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnTokenExpired(logout);
    return () => setOnTokenExpired(null);
  }, [logout]);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getMe();

      if (userData.cargo !== ROLES.DRIVER) {
        throw new Error("Acesso restrito a motoristas.");
      }

      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, senha: string) => {
    setIsAuthLoading(true);
    setError(null);
    try {
      await setAuthToken(null);
      
      const responseData = await authService.login(email, senha);
      const token =
        responseData.auth_token ||
        responseData.access_token ||
        responseData.token;
      
      if (token) {
        await setAuthToken(token);
      }

      const userData = await authService.getMe();

      if (userData.cargo !== ROLES.DRIVER) {
        throw new Error("Acesso permitido apenas para motoristas.");
      }

      setUser(userData);
      return userData;
    } catch (err: any) {
      console.error("Erro no fluxo de login:", err);
      const msg = err.response?.data?.detail || err.message || "Falha no login";
      setError(msg);
      setUser(null);
      throw new Error(msg);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthLoading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  }), [user, isLoading, isAuthLoading, error, login, logout, refreshUser, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
