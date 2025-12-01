import React from "react";
import { View } from "react-native";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export const ThemedCard = ({
  children,
  className = "",
  style = {},
  ...props
}) => {
  const { isDark, bg, colors } = useThemeStyles();

  return (
    <View
      className={`${bg.card} ${isDark ? "shadow-lg" : "shadow-md"} ${className}`}
      style={{
        ...(isDark
          ? {
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }
          : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </View>
  );
};
