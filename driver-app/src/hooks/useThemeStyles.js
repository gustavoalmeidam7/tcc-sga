import { useTheme } from "@/src/contexts/ThemeContext";

export const useThemeStyles = () => {
  const { isDark, colors } = useTheme();

  return {
    isDark,
    colors,
    bg: {
      primary: isDark ? "bg-dark-background" : "bg-white",
      secondary: isDark ? "bg-dark-background-secondary" : "bg-gray-50",
      muted: isDark ? "bg-dark-background-muted" : "bg-gray-100",
      card: isDark ? "bg-dark-card border border-dark-border" : "bg-white",
    },
    text: {
      primary: isDark ? "text-dark-foreground" : "text-gray-900",
      secondary: isDark ? "text-dark-foreground-secondary" : "text-gray-700",
      muted: isDark ? "text-dark-foreground-muted" : "text-gray-500",
      inverse: isDark ? "text-white" : "text-gray-900",
    },
    border: {
      primary: isDark ? "border-dark-border" : "border-gray-200",
      secondary: isDark ? "border-dark-border" : "border-gray-300",
    },
    style: {
      background: colors.background,
      backgroundSecondary: colors.backgroundSecondary,
      card: colors.card,
      foreground: colors.foreground,
      foregroundMuted: colors.foregroundMuted,
      border: colors.border,
    },
  };
};

