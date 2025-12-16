import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useTheme } from "@/contexts/ThemeContext";
import * as Notifications from "expo-notifications";


interface SectionHeaderProps {
  title: string;
  isDark: boolean;
}

const SectionHeader = ({ title, isDark }: SectionHeaderProps) => {
  const textColor = isDark ? "text-dark-foreground-muted" : "text-gray-500";
  return (
    <Text
      className={`px-5 py-3 text-xs font-bold ${textColor} uppercase tracking-wider`}
    >
      {title}
    </Text>
  );
};

interface ThemeOption {
  label: string;
  value: string;
}

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: boolean | string;
  type?: "arrow" | "switch" | "info" | "theme";
  onPress?: () => void;
  onValueChange?: (value: any) => void;
  color?: string;
  themeOptions?: ThemeOption[];
  currentTheme?: string;
  isDark?: boolean;
  colors?: any;
}

const SettingItem = memo(
  ({
    icon,
    label,
    value,
    type = "arrow",
    onPress,
    onValueChange,
    color = "#3B82F6",
    themeOptions = [],
    currentTheme,
    isDark = false,
    colors = { border: "#E2E8F0" },
  }: SettingItemProps) => {
    const safeIsDark = Boolean(isDark);
    const safeColors =
      colors && typeof colors === "object" ? colors : { border: "#E2E8F0" };

    const bgColor = safeIsDark ? "bg-dark-card" : "bg-white";
    const textColor = safeIsDark ? "text-dark-foreground" : "text-gray-900";
    const borderColor = safeIsDark ? "border-dark-border" : "border-gray-100";
    const mutedTextColor = safeIsDark
      ? "text-dark-foreground-muted"
      : "text-gray-500";

    if (type === "theme") {
      return (
        <View
          className={`px-5 py-4 ${bgColor} border-b ${borderColor} ${safeIsDark ? "shadow-sm" : ""}`}
          style={
            safeIsDark
              ? {
                  borderWidth: 1,
                  borderColor: safeColors.border,
                  borderTopWidth: 0,
                }
              : {}
          }
        >
          <View className="flex-row items-center mb-3">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center mr-4"
              style={{ backgroundColor: `${color}15` }}
            >
              <Feather name={icon} size={18} color={color} />
            </View>
            <Text className={`flex-1 text-base font-medium ${textColor}`}>
              {label}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onValueChange?.(option.value)}
                className={`flex-1 py-2.5 rounded-xl border ${
                  currentTheme === option.value
                    ? "bg-blue-500 border-blue-500"
                    : `${bgColor} ${borderColor}`
                }`}
                style={
                  currentTheme === option.value
                    ? {}
                    : safeIsDark
                      ? { borderColor: safeColors.border }
                      : {}
                }
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    currentTheme === option.value
                      ? "text-white"
                      : mutedTextColor
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (type === "switch") {
      return (
        <View
          className={`px-5 py-4 ${bgColor} border-b ${borderColor} flex-row items-center`}
          style={
            safeIsDark
              ? {
                  borderWidth: 1,
                  borderColor: safeColors.border,
                  borderTopWidth: 0,
                }
              : {}
          }
        >
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-4"
            style={{ backgroundColor: `${color}15` }}
          >
            <Feather name={icon} size={18} color={color} />
          </View>
          <Text className={`flex-1 text-base font-medium ${textColor}`}>
            {label}
          </Text>
          <Switch
            value={Boolean(value)}
            onValueChange={onValueChange}
            trackColor={{
              false: safeIsDark ? "#334155" : "#D1D5DB",
              true: "#60A5FA",
            }}
            thumbColor={value ? "#3B82F6" : "#F3F4F6"}
          />
        </View>
      );
    }

    if (type === "info") {
      return (
        <View
          className={`px-5 py-4 ${bgColor} border-b ${borderColor} flex-row items-center`}
          style={
            safeIsDark
              ? {
                  borderWidth: 1,
                  borderColor: safeColors.border,
                  borderTopWidth: 0,
                }
              : {}
          }
        >
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-4"
            style={{ backgroundColor: `${color}15` }}
          >
            <Feather name={icon} size={18} color={color} />
          </View>
          <Text className={`flex-1 text-base font-medium ${textColor}`}>
            {label}
          </Text>
          <Text className={`text-sm ${mutedTextColor}`}>{value}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`px-5 py-4 ${bgColor} border-b ${borderColor} flex-row items-center`}
        style={
          safeIsDark
            ? {
                borderWidth: 1,
                borderColor: safeColors.border,
                borderTopWidth: 0,
              }
            : {}
        }
        activeOpacity={0.7}
      >
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-4"
          style={{ backgroundColor: `${color}15` }}
        >
          <Feather name={icon} size={18} color={color} />
        </View>
        <Text className={`flex-1 text-base font-medium ${textColor}`}>
          {label}
        </Text>
        <Feather
          name="chevron-right"
          size={20}
          color={safeIsDark ? "#64748B" : "#9CA3AF"}
        />
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.currentTheme === nextProps.currentTheme &&
      prevProps.isDark === nextProps.isDark &&
      prevProps.colors?.border === nextProps.colors?.border
    );
  }
);

SettingItem.displayName = "SettingItem";

export default function Configuracoes() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { preferences, updatePreference } = usePreferences();
  const { isDark, colors } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === "granted");
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setNotificationsEnabled(true);
        updatePreference("notifications", true);
        Alert.alert("Sucesso", "Notificações ativadas com sucesso!");
      } else {
        Alert.alert(
          "Permissão Negada",
          "Para receber notificações, ative nas configurações do dispositivo."
        );
        setNotificationsEnabled(false);
        updatePreference("notifications", false);
      }
    } else {
      setNotificationsEnabled(false);
      updatePreference("notifications", false);
      Alert.alert("Notificações Desativadas", "Você não receberá mais notificações do app.");
    }
  };

  const themeProps = useMemo(
    () => ({
      isDark,
      colors,
    }),
    [isDark, colors]
  );

  const handleThemeChange = useCallback(
    (val: string) => {
      try {
        setIsChangingTheme(true);
        updatePreference("theme", val);
        setTimeout(() => {
          setIsChangingTheme(false);
        }, 100);
      } catch (error) {
        console.error("Erro ao mudar tema:", error);
        setIsChangingTheme(false);
      }
    },
    [updatePreference]
  );

  React.useEffect(() => {
    if (isChangingTheme) {
      const timer = setTimeout(() => {
        setIsChangingTheme(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [preferences?.theme, isChangingTheme]);

  if (!navigation || !preferences) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const bgColor = isDark ? "bg-dark-background" : "bg-gray-50";
  const headerBg = isDark ? "bg-dark-card" : "bg-white";
  const headerBorder = isDark ? "border-dark-border" : "border-gray-200";
  const headerText = isDark ? "text-dark-foreground" : "text-gray-900";

  return (
    <View className={`flex-1 ${bgColor}`} style={{ paddingTop: insets.top }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
      />

      <View
        className={`${headerBg} px-5 py-4 border-b ${headerBorder} flex-row items-center`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Feather
            name="arrow-left"
            size={24}
            color={isDark ? "#F1F5F9" : "#1F2937"}
          />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${headerText}`}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isChangingTheme && (
          <>
            <View className="mt-4">
              <SectionHeader title="Aparência" isDark={isDark} />
              <SettingItem
                icon="moon"
                label="Tema"
                type="theme"
                currentTheme={preferences.theme || "light"}
                onValueChange={handleThemeChange}
                themeOptions={[
                  { label: "Claro", value: "light" },
                  { label: "Escuro", value: "dark" },
                ]}
                color="#6B7280"
                isDark={themeProps.isDark}
                colors={themeProps.colors}
              />
            </View>

            <View className="mt-4">
              <SectionHeader title="Notificações" isDark={isDark} />
              <SettingItem
                icon="bell"
                label="Permitir Notificações"
                type="switch"
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                color="#F59E0B"
                isDark={themeProps.isDark}
                colors={themeProps.colors}
              />
              <SettingItem
                icon="volume-2"
                label="Sons e Alertas"
                type="switch"
                value={preferences.sounds}
                onValueChange={(val) => updatePreference("sounds", val)}
                color="#F59E0B"
                isDark={themeProps.isDark}
                colors={themeProps.colors}
              />
            </View>

            <View className="mt-4">
              <SectionHeader title="Navegação" isDark={isDark} />
              <SettingItem
                icon="eye-off"
                label="Ocultar controles automaticamente"
                type="switch"
                value={preferences.autoHideNavigationControls}
                onValueChange={(val) =>
                  updatePreference("autoHideNavigationControls", val)
                }
                color="#3B82F6"
                isDark={themeProps.isDark}
                colors={themeProps.colors}
              />
            </View>

            <View className="mt-4 mb-8">
              <SectionHeader title="Sistema" isDark={isDark} />
              <SettingItem
                icon="info"
                label="Versão do App"
                type="info"
                value="1.0.0"
                color="#6B7280"
                isDark={themeProps.isDark}
                colors={themeProps.colors}
              />
            </View>
          </>
        )}
        {isChangingTheme && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator
              size="large"
              color={isDark ? "#60A5FA" : "#3B82F6"}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
