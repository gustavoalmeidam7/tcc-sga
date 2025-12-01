import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PreferencesContext = createContext({});

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
    sounds: true,
    satelliteMap: false,
    alternativeRoutes: true,
    autoHideNavigationControls: true,
    biometrics: false,
  });
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

  const updatePreference = async (key, value) => {
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
