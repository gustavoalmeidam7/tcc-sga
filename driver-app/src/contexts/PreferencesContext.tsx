import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  sounds: boolean;
  satelliteMap: boolean;
  alternativeRoutes: boolean;
  autoHideNavigationControls: boolean;
  biometrics: boolean;
  [key: string]: any;
}

interface PreferencesContextData {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => Promise<void>;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: "light",
  notifications: true,
  sounds: true,
  satelliteMap: false,
  alternativeRoutes: true,
  autoHideNavigationControls: true,
  biometrics: false,
};

const PreferencesContext = createContext<PreferencesContextData>({
  preferences: defaultPreferences,
  updatePreference: async () => {},
  loading: true,
});

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem("user_preferences");
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await AsyncStorage.setItem(
        "user_preferences",
        JSON.stringify(newPreferences)
      );
    } catch (error) {
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
