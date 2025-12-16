import React, { useState } from "react";
import { View, TextInput, TextInputProps, TouchableOpacity, Text } from "react-native";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { LucideIcon } from "lucide-react-native";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  leftIcon?: LucideIcon | React.ComponentType<any>;
  rightIcon?: LucideIcon | React.ComponentType<any>;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  containerClassName = "",
  style,
  ...props
}) => {
  const { colors, isDark } = useThemeStyles();
  const [isFocused, setIsFocused] = useState(false);

  const styles = {
    container: {
      backgroundColor: isDark ? colors.input : "#F8FAFC",
      borderColor: error
        ? "#EF4444"
        : isFocused
        ? isDark ? colors.primary : "#3B82F6"
        : isDark ? colors.border : "#E2E8F0",
      borderWidth: 1.5,
    },
    label: {
      color: isDark ? colors.foregroundMuted : "#64748B",
    },
    input: {
      color: isDark ? colors.foreground : "#1E293B",
    },
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text
          style={styles.label}
          className="text-sm font-semibold mb-2 ml-1"
        >
          {label}
        </Text>
      )}
      <View
        className="flex-row items-center rounded-xl px-4 py-3.5"
        style={styles.container}
      >
        {LeftIcon && (
          <View className="mr-3">
            <LeftIcon
              size={20}
              color={isFocused ? (isDark ? colors.primary : "#3B82F6") : (isDark ? colors.foregroundMuted : "#94A3B8")}
            />
          </View>
        )}
        
        <TextInput
          {...props}
          style={[styles.input, { flex: 1, fontSize: 16 }]}
          placeholderTextColor={isDark ? colors.foregroundMuted : "#94A3B8"}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {RightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            activeOpacity={0.7}
            className="ml-3"
          >
            <RightIcon
              size={20}
              color={isFocused ? (isDark ? colors.foreground : "#1E293B") : (isDark ? colors.foregroundMuted : "#94A3B8")}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
