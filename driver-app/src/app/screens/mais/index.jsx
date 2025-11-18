import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.navigate("Login");
        },
      },
    ]);
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
      className="flex-1 bg-light-background-secondary"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
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
          <Text className="text-xs font-bold text-light-foreground-muted uppercase tracking-wide mb-3">
            Ações Rápidas
          </Text>
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("Perfil")}
              className="flex-1 bg-light-card rounded-2xl p-5 items-center shadow-md"
              activeOpacity={0.7}
            >
              <View
                className="p-3 rounded-full mb-3"
                style={{ backgroundColor: "#3B82F620" }}
              >
                <Feather name="user" size={24} color="#3B82F6" />
              </View>
              <Text className="text-sm font-bold text-light-foreground">
                Ver Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-light-card rounded-2xl p-5 items-center shadow-md"
              activeOpacity={0.7}
            >
              <View className="bg-light-background-muted p-3 rounded-full mb-3">
                <Feather name="settings" size={24} color="#64748B" />
              </View>
              <Text className="text-sm font-bold text-light-foreground">
                Configurações
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu de opções */}
        <View className="px-5 mt-4">
          <Text className="text-xs font-bold text-light-foreground-muted uppercase tracking-wide mb-3">
            Mais Opções
          </Text>
          <View className="bg-light-card rounded-2xl shadow-md overflow-hidden">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center px-5 py-4 ${
                  index !== menuItems.length - 1
                    ? "border-b border-light-border"
                    : ""
                }`}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View className="bg-light-background-muted p-2.5 rounded-full mr-4">
                  <Feather name={item.icon} size={20} color="#64748B" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-light-foreground">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-light-foreground-muted mt-0.5">
                    {item.subtitle}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#E2E8F0" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão de logout */}
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
    </View>
  );
}
