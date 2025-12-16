import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useThemeStyles } from "../hooks/useThemeStyles";

export default function Sobre() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, bg, text, border, colors } = useThemeStyles();

  const appInfo = {
    name: "SGA Motorista",
    version: "1.0.0",
    description:
      "Sistema de Gerenciamento de Ambulâncias - Aplicativo para motoristas de ambulância gerenciarem viagens e atendimentos de emergência.",
    developer: "Maicon",
    year: "2025",
  };

  const links = [
    {
      icon: "globe" as const,
      title: "Site Oficial",
      subtitle: "tcc-sga.pages.dev",
      action: () => Linking.openURL("https://tcc-sga.pages.dev/"),
    },
    {
      icon: "file-text" as const,
      title: "Termos de Uso",
      subtitle: "Condições de utilização",
      action: () => navigation.navigate("Termos" as never),
    },
  ];

  const features = [
    {
      icon: "map-pin" as const,
      title: "Navegação em Tempo Real",
      description: "GPS integrado com rotas otimizadas",
    },
    {
      icon: "bell" as const,
      title: "Notificações Instantâneas",
      description: "Alertas de novas viagens",
    },
    {
      icon: "activity" as const,
      title: "Histórico Completo",
      description: "Acompanhe todas as suas viagens",
    },
  ];

  return (
    <View className={`flex-1 ${bg.secondary}`} style={{ paddingTop: insets.top }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
      />

      {/* Header */}
      <View className={`${bg.card} px-5 py-4 border-b ${border.primary} flex-row items-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color={isDark ? "#F1F5F9" : "#1F2937"} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${text.primary}`}>Sobre o App</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Icon & Info */}
        <View className="items-center pt-8 pb-6 px-5">
          <View
            className="w-24 h-24 rounded-3xl bg-light-primary items-center justify-center mb-4 shadow-lg"
            style={{ shadowColor: "#3B82F6", shadowOpacity: 0.3, shadowRadius: 10 }}
          >
            <Feather name="truck" size={48} color="white" />
          </View>
          <Text className={`text-2xl font-bold ${text.primary} mb-2`}>
            {appInfo.name}
          </Text>
          <Text className={`text-sm ${text.muted} mb-1`}>
            Versão {appInfo.version}
          </Text>
          <Text className={`text-center text-sm ${text.muted} leading-5 mt-3 px-4`}>
            {appInfo.description}
          </Text>
        </View>

        {/* Features */}
        <View className="px-5 mt-2">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Recursos Principais
          </Text>
          <View className="gap-3">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`${bg.card} rounded-2xl p-4 flex-row items-start ${
                  isDark ? "shadow-lg" : "shadow-md"
                }`}
                style={
                  isDark
                    ? {
                        borderWidth: 1,
                        borderColor: colors.border,
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                      }
                    : {}
                }
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#3B82F620" }}
                >
                  <Feather name={feature.icon} size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary} mb-1`}>
                    {feature.title}
                  </Text>
                  <Text className={`text-sm ${text.muted}`}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View className="px-5 mt-6">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Links Úteis
          </Text>
          <View
            className={`${bg.card} rounded-2xl overflow-hidden ${isDark ? "shadow-lg" : "shadow-md"}`}
            style={
              isDark
                ? {
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }
                : {}
            }
          >
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={link.action}
                className={`flex-row items-center px-4 py-4 ${
                  index !== links.length - 1 ? `border-b ${border.primary}` : ""
                }`}
                activeOpacity={0.7}
              >
                <View className={`${bg.muted} p-2.5 rounded-full mr-4`}>
                  <Feather
                    name={link.icon}
                    size={20}
                    color={isDark ? "#94A3B8" : "#64748B"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary}`}>
                    {link.title}
                  </Text>
                  <Text className={`text-sm ${text.muted} mt-0.5`}>
                    {link.subtitle}
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={isDark ? "#64748B" : "#CBD5E1"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Developer Info */}
        <View className="px-5 mt-6 mb-8">
          <View
            className={`${bg.card} rounded-2xl p-5 items-center ${
              isDark ? "shadow-lg" : "shadow-md"
            }`}
            style={
              isDark
                ? {
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }
                : {}
            }
          >
            <Feather
              name="code"
              size={32}
              color={isDark ? "#60A5FA" : "#3B82F6"}
              style={{ marginBottom: 12 }}
            />
            <Text className={`text-sm ${text.muted} text-center mb-1`}>
              Desenvolvido por
            </Text>
            <Text className={`text-base font-bold ${text.primary} text-center mb-3`}>
              {appInfo.developer}
            </Text>
            <Text className={`text-xs ${text.muted}`}>
              © {appInfo.year} - Todos os direitos reservados
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
