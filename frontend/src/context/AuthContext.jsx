import React, { useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import { setAuthToken, clearAuthToken, getAuthToken } from '../services/tokenStore';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserOnMount = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          clearAuthToken();
        }
      }
    };

    loadUserOnMount();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { access_token } = response;
      setAuthToken(access_token);
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Falha ao remover o token', error);
    }
    clearAuthToken();
    setUser(null);
  }, []);

  const register = useCallback(async (userData) => {
    const registeredUser = await authService.register(userData);
    return registeredUser;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
