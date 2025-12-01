import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { usePreferences } from "@/src/contexts/PreferencesContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import ConfirmModal from "@/src/components/ConfirmModal";

const SectionHeader = ({ title, isDark }) => {
  const textColor = isDark ? "text-dark-foreground-muted" : "text-gray-500";
  return (
    <Text
      className={`px-5 py-3 text-xs font-bold ${textColor} uppercase tracking-wider`}
    >
      {title}
    </Text>
  );
};

const SettingItem = ({
  icon,
  label,
  value,
  type = "arrow",
  onPress,
  onValueChange,
  color = "#3B82F6",
  themeOptions,
  currentTheme,
}) => {
  const { isDark, colors } = useTheme();
  const bgColor = isDark ? "bg-dark-card" : "bg-white";
  const textColor = isDark ? "text-dark-foreground" : "text-gray-900";
  const borderColor = isDark ? "border-dark-border" : "border-gray-100";
  const mutedTextColor = isDark
    ? "text-dark-foreground-muted"
    : "text-gray-500";

  if (type === "theme") {
    return (
      <View
        className={`px-5 py-4 ${bgColor} border-b ${borderColor} ${isDark ? "shadow-sm" : ""}`}
        style={
          isDark
            ? { borderWidth: 1, borderColor: colors.border, borderTopWidth: 0 }
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
        <View className="flex-row gap-2 ml-12">
          {themeOptions.map((option) => {
            const isSelected = currentTheme === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => onValueChange(option.value)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 ${
                  isSelected ? "" : `${borderColor} ${bgColor}`
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: color,
                        backgroundColor: `${color}15`,
                      }
                    : undefined
                }
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center text-sm font-medium ${
                    isSelected ? "" : mutedTextColor
                  }`}
                  style={isSelected ? { color } : undefined}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={type === "switch" ? () => onValueChange(!value) : onPress}
      disabled={type === "info"}
      activeOpacity={0.7}
      className={`flex-row items-center px-5 py-4 ${bgColor} border-b ${borderColor} ${isDark ? "shadow-sm" : ""}`}
      style={
        isDark
          ? { borderWidth: 1, borderColor: colors.border, borderTopWidth: 0 }
          : {}
      }
    >
      <View
        className="w-8 h-8 rounded-lg items-center justify-center mr-4"
        style={{ backgroundColor: type === "info" ? "#F3F4F6" : `${color}15` }}
      >
        <Feather
          name={icon}
          size={18}
          color={type === "info" ? "#9CA3AF" : color}
        />
      </View>
      <Text className={`flex-1 text-base font-medium ${textColor}`}>
        {label}
      </Text>

      {type === "switch" && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#E5E7EB", true: color }}
          thumbColor={"#FFFFFF"}
        />
      )}

      {type === "arrow" && (
        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      )}

      {type === "info" && (
        <Text className={`text-sm ${mutedTextColor}`}>{value}</Text>
      )}
    </TouchableOpacity>
  );
};

export default function Configuracoes() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { preferences, updatePreference } = usePreferences();
  const { isDark } = useTheme();

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
        <View className="mt-4">
          <SectionHeader title="Aparência" isDark={isDark} />
          <SettingItem
            icon="moon"
            label="Tema"
            type="theme"
            currentTheme={preferences.theme || "light"}
            onValueChange={(val) => updatePreference("theme", val)}
            themeOptions={[
              { label: "Claro", value: "light" },
              { label: "Escuro", value: "dark" },
            ]}
            color="#6B7280"
          />
        </View>

        <View className="mt-4">
          <SectionHeader title="Geral" isDark={isDark} />
          <SettingItem
            icon="bell"
            label="Notificações Push"
            type="switch"
            value={preferences.notifications}
            onValueChange={(val) => updatePreference("notifications", val)}
            color="#F59E0B"
          />
          <SettingItem
            icon="volume-2"
            label="Sons e Alertas"
            type="switch"
            value={preferences.sounds}
            onValueChange={(val) => updatePreference("sounds", val)}
            color="#F59E0B"
          />
        </View>

        <View className="mt-4 mb-8">
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
          />
        </View>
      </ScrollView>
    </View>
  );
}
