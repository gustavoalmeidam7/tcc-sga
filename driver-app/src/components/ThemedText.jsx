import React from "react";
import { Text } from "react-native";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export const ThemedText = ({
  children,
  className = "",
  style = {},
  variant = "primary",
  ...props
}) => {
  const { text } = useThemeStyles();

  const textClass = {
    primary: text.primary,
    secondary: text.secondary,
    muted: text.muted,
    inverse: text.inverse,
  }[variant] || text.primary;

  return (
    <Text
      className={`${textClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
};

