import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import authService from "../services/auth";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "../services/tokenStore";
import { setOnTokenExpired } from "../services/api";
import { ROLES } from "@/src/lib/roles";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    await clearAuthToken();
    setUser(null);
  }, []);

  useEffect(() => {
    setOnTokenExpired(logout);
    return () => setOnTokenExpired(null);
  }, [logout]);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await authService.getMe();

      if (userData.cargo !== ROLES.DRIVER) {
        throw new Error("Acesso restrito a motoristas.");
      }

      setUser(userData);
    } catch (err) {
      console.log("Sessão inválida ou expirada:", err.message);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email, senha) => {
      setIsAuthLoading(true);
      setError(null);
      try {
        const { access_token } = await authService.login(email, senha);
        await setAuthToken(access_token);

        const userData = await authService.getMe();

        if (userData.cargo !== ROLES.DRIVER) {
          throw new Error("Acesso permitido apenas para motoristas.");
        }

        setUser(userData);
        return userData;
      } catch (err) {
        const msg =
          err.response?.data?.detail || err.message || "Falha no login";
        setError(msg);
        await logout();
        throw new Error(msg);
      } finally {
        setIsAuthLoading(false);
      }
    },
    [logout]
  );

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthLoading,
        error,
        login,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
