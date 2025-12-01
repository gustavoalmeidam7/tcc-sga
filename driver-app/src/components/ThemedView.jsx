import React from "react";
import { View } from "react-native";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export const ThemedView = ({
  children,
  className = "",
  style = {},
  variant = "primary",
  ...props
}) => {
  const { bg } = useThemeStyles();

  const bgClass = {
    primary: bg.primary,
    secondary: bg.secondary,
    muted: bg.muted,
    card: bg.card,
  }[variant] || bg.primary;

  return (
    <View
      className={`${bgClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};

