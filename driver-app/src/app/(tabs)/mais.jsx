import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import ConfirmModal from "@/src/components/ConfirmModal";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { isDark, bg, text, border, colors } = useThemeStyles();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const menuItems = [
    {
      icon: "help-circle",
      title: "Suporte",
      subtitle: "Central de ajuda e atendimento",
    },
    {
      icon: "info",
      title: "Sobre o App",
      subtitle: "Versão 1.0.0 - Informações do sistema",
    },
    {
      icon: "file-text",
      title: "Termos e Condições",
      subtitle: "Políticas de uso e privacidade",
      action: () => navigation.navigate("Termos"),
    },
  ];

  return (
    <View
      className={`flex-1 ${bg.secondary}`}
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0F172A" : "#FFFFFF"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          className="bg-light-primary p-6 flex-row items-center rounded-full mx-2 mt-5"
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Perfil")}
        >
          <View className="w-16 h-16 rounded-full bg-white/20 justify-center items-center">
            <Feather name="user" size={32} color="white" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-white">
              {user?.nome || ""}
            </Text>
            <Text className="text-sm text-green-100 mt-1">
              {user?.email || ""}
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color="white" />
        </TouchableOpacity>

        <View className="px-5 mt-6">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Ações Rápidas
          </Text>
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("Perfil")}
              className={`flex-1 ${bg.card} rounded-2xl p-5 items-center ${isDark ? "shadow-lg" : "shadow-md"}`}
              style={isDark ? { borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 } : {}}
              activeOpacity={0.7}
            >
              <View
                className="p-3 rounded-full mb-3"
                style={{ backgroundColor: "#3B82F620" }}
              >
                <Feather name="user" size={24} color="#3B82F6" />
              </View>
              <Text className={`text-sm font-bold ${text.primary}`}>
                Ver Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 ${bg.card} rounded-2xl p-5 items-center ${isDark ? "shadow-lg" : "shadow-md"}`}
              style={isDark ? { borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 } : {}}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Configuracoes")}
            >
              <View className={`${bg.muted} p-3 rounded-full mb-3`}>
                <Feather name="settings" size={24} color={isDark ? "#94A3B8" : "#64748B"} />
              </View>
              <Text className={`text-sm font-bold ${text.primary}`}>
                Configurações
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 mt-4">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Mais Opções
          </Text>
          <View 
            className={`${bg.card} rounded-2xl ${isDark ? "shadow-lg" : "shadow-md"} overflow-hidden`}
            style={isDark ? { borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 } : {}}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center px-5 py-4 ${
                  index !== menuItems.length - 1
                    ? `border-b ${border.primary}`
                    : ""
                }`}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View className={`${bg.muted} p-2.5 rounded-full mr-4`}>
                  <Feather name={item.icon} size={20} color={isDark ? "#94A3B8" : "#64748B"} />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary}`}>
                    {item.title}
                  </Text>
                  <Text className={`text-sm ${text.muted} mt-0.5`}>
                    {item.subtitle}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={isDark ? "#64748B" : "#E2E8F0"} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-5 mt-6 mb-8">
          <TouchableOpacity
            className="bg-light-error py-4 rounded-2xl items-center shadow-md flex-row justify-center"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={20} color="white" />
            <Text className="text-white text-base font-bold ml-2">
              Sair da Conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showLogoutConfirm}
        title="Sair da Conta"
        message="Tem certeza que deseja sair?"
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Sair"
        type="danger"
      />
    </View>
  );
}
