import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { Buffer } from "buffer";

global.Buffer = Buffer;

const isWeb = Platform.OS === "web";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    if (!payload.exp) {
      return false;
    }

    const now = Date.now() / 1000;
    const expirationBuffer = 5 * 60;

    return payload.exp < now + expirationBuffer;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return true;
  }
};

export const getAuthToken = async () => {
  let token;
  
  if (isWeb) {
    token = localStorage.getItem("authToken");
  } else {
    token = await SecureStore.getItemAsync("authToken");
  }

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    await clearAuthToken();
    return null;
  }

  return token;
};

export const setAuthToken = async (token) => {
  if (token) {
    if (isWeb) {
      localStorage.setItem("authToken", token);
    } else {
      await SecureStore.setItemAsync("authToken", token);
    }
  } else {
    await clearAuthToken();
  }
};

export const clearAuthToken = async () => {
  try {
    if (isWeb) {
      localStorage.removeItem("authToken");
    } else {
      await SecureStore.deleteItemAsync("authToken");
    }
  } catch (error) {
    console.warn("Falha ao limpar token (ignorado):", error);
  }
};
