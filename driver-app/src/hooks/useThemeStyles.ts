import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  card: string;
  input: string;
  foreground: string;
  foregroundMuted: string;
  [key: string]: string;
}

interface ThemeVariant {
  primary: string;
  secondary: string;
  muted: string;
  card?: string;
  [key: string]: string | undefined;
}

export interface ThemeStyles {
  isDark: boolean;
  colors: ThemeColors;
  bg: ThemeVariant;
  text: ThemeVariant;
  border: ThemeVariant;
}

export function useThemeStyles(): ThemeStyles {
  const { isDark, colors } = useTheme();

  const bg: ThemeVariant = useMemo(
    () => ({
      primary: isDark ? "bg-slate-900" : "bg-slate-50",
      secondary: isDark ? "bg-slate-950" : "bg-white",
      muted: isDark ? "bg-slate-800" : "bg-slate-100",
      card: isDark ? "bg-slate-800" : "bg-white",
    }),
    [isDark]
  );

  const text: ThemeVariant = useMemo(
    () => ({
      primary: isDark ? "text-slate-50" : "text-slate-900",
      secondary: isDark ? "text-slate-400" : "text-slate-500",
      muted: isDark ? "text-slate-500" : "text-slate-400",
    }),
    [isDark]
  );

  const border: ThemeVariant = useMemo(
    () => ({
      primary: isDark ? "border-slate-700" : "border-slate-200",
      secondary: isDark ? "border-slate-800" : "border-slate-300",
      muted: isDark ? "border-slate-800" : "border-slate-100",
    }),
    [isDark]
  );

  return { isDark, colors: colors as ThemeColors, bg, text, border };
}
