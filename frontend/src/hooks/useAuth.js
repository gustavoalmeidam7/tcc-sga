import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('hehehe erro, já quebrou tudo kkkk');
  }
  return context;
};
