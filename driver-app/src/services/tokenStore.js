import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString());
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return true;
  }
};

export const getAuthToken = async () => {
  const token = await SecureStore.getItemAsync("authToken");
  if (token && isTokenExpired(token)) {
    await clearAuthToken();
    return null;
  }
  return token;
};

export const setAuthToken = async (token) => {
  if (token) {
    await SecureStore.setItemAsync("authToken", token);
  } else {
    await SecureStore.deleteItemAsync("authToken");
  }
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync("authToken");
};
