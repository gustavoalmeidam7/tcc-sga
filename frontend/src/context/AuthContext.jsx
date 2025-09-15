import React, { useCallback } from 'react';
import authService from '../services/authService';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }) => {

  const register = useCallback(async (userData) => {
    const registeredUser = await authService.register(userData);
    return registeredUser;
  }, []);

  const value = {
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
