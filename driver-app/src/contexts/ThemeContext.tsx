import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { usePreferences } from "./PreferencesContext";
import { getThemeColors } from "@/lib/theme-utils";
import { ThemeColors } from "@/hooks/useThemeStyles";

interface ThemeContextData {
  theme: "light" | "dark";
  isDark: boolean;
  colorScheme: "light" | "dark";
  colors: ThemeColors | {};
}

const ThemeContext = createContext<ThemeContextData>({
  theme: "light",
  isDark: false,
  colorScheme: "light",
  colors: {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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

