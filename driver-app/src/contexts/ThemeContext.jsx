import React, { createContext, useContext } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { usePreferences } from "./PreferencesContext";
import { getThemeColors } from "@/src/lib/theme-utils";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  colorScheme: "light",
  colors: {},
});

export const ThemeProvider = ({ children }) => {
  const { preferences } = usePreferences();
  const systemColorScheme = useRNColorScheme();

  const theme =
    preferences.theme || (systemColorScheme === "dark" ? "dark" : "light");
  const isDark = theme === "dark";
  const colorScheme = theme;

  const colors = getThemeColors(isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, colorScheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
