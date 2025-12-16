import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from "react-native";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";

interface ThemedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: LucideIcon | React.ComponentType<any>;
  rightIcon?: LucideIcon | React.ComponentType<any>;
  className?: string;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  onPress,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  style,
}) => {
  const { colors, isDark } = useThemeStyles();
  const scale = useSharedValue(1);

  const getBackgroundColor = () => {
    if (disabled) return isDark ? colors.muted : "#94A3B8";
    switch (variant) {
      case "primary": return isDark ? colors.primary : "#3B82F6";
      case "secondary": return isDark ? colors.card : "#FFFFFF";
      case "destructive": return "#EF4444";
      case "outline": return "transparent";
      case "ghost": return "transparent";
      default: return isDark ? colors.primary : "#3B82F6";
    }
  };

  const getTextColor = () => {
    if (disabled) return "#E2E8F0";
    switch (variant) {
      case "primary": return "#FFFFFF";
      case "secondary": return isDark ? colors.foreground : "#1F2937";
      case "destructive": return "#FFFFFF";
      case "outline": return isDark ? colors.primary : "#3B82F6";
      case "ghost": return isDark ? colors.foreground : "#1F2937";
      default: return "#FFFFFF";
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const paddingY = size === "sm" ? 8 : size === "md" ? 14 : 18;
  const paddingX = size === "sm" ? 12 : size === "md" ? 16 : 24;
  const fontSize = size === "sm" ? 12 : size === "md" ? 16 : 18;

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      activeOpacity={0.9}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: paddingY,
          paddingHorizontal: paddingX,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: variant === "outline" ? (isDark ? colors.primary : "#3B82F6") : "transparent",
          opacity: disabled ? 0.7 : 1,
          shadowColor: variant === "primary" ? (isDark ? colors.primary : "#3B82F6") : "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variant === "primary" ? 0.3 : 0,
          shadowRadius: 8,
          elevation: variant === "primary" ? 4 : 0,
        },
        animatedStyle,
        style,
      ]}
      className={className}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {LeftIcon && <LeftIcon size={fontSize + 4} color={getTextColor()} style={{ marginRight: 8 }} />}
          <Text
            style={{
              color: getTextColor(),
              fontSize: fontSize,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {children}
          </Text>
          {RightIcon && <RightIcon size={fontSize + 4} color={getTextColor()} style={{ marginLeft: 8 }} />}
        </>
      )}
    </AnimatedTouchable>
  );
};
