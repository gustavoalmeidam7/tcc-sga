import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useThemeStyles } from "../hooks/useThemeStyles";

export default function Suporte() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, bg, text, border, colors } = useThemeStyles();

  const handleEmail = () => {
    const email = "sga.suporte.br@gmail.com";
    const subject = "Suporte - App Motorista";
    const body = "Olá, preciso de ajuda com...";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch((err) =>
      Alert.alert("Erro", "Não foi possível abrir o cliente de email")
    );
  };

  const handlePhone = () => {
    const phoneNumber = "tel:+551633334444";
    
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          Alert.alert("Erro", "Não foi possível fazer a ligação");
        }
      })
      .catch((err) => console.error("Erro ao fazer ligação:", err));
  };

  const contactOptions = [
    {
      icon: "mail" as const,
      title: "Email",
      subtitle: "suporte@tcc-sga.com",
      color: "#3B82F6",
      action: handleEmail,
    },
    {
      icon: "phone" as const,
      title: "Telefone",
      subtitle: "(16) 3333-4444",
      color: "#F59E0B",
      action: handlePhone,
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
        <Text className={`text-xl font-bold ${text.primary}`}>Central de Ajuda</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ajuda Rápida */}
        <View className="px-5 mt-6">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Ajuda Rápida
          </Text>
          <View className="gap-3">
            <View
              className={`${bg.card} rounded-2xl p-4 ${isDark ? "shadow-lg" : "shadow-md"}`}
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
              <View className="flex-row items-start mb-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#3B82F620" }}
                >
                  <Feather name="info" size={16} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary} mb-1`}>
                    Problemas com GPS?
                  </Text>
                  <Text className={`text-sm ${text.muted} leading-5`}>
                    Verifique se a localização está ativada nas configurações do dispositivo e se você concedeu permissão ao app.
                  </Text>
                </View>
              </View>
            </View>

            <View
              className={`${bg.card} rounded-2xl p-4 ${isDark ? "shadow-lg" : "shadow-md"}`}
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
              <View className="flex-row items-start mb-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#10B98120" }}
                >
                  <Feather name="check-circle" size={16} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary} mb-1`}>
                    Como aceitar viagens?
                  </Text>
                  <Text className={`text-sm ${text.muted} leading-5`}>
                    Quando uma solicitação aparecer, toque em "Aceitar Viagem" na notificação ou na tela inicial.
                  </Text>
                </View>
              </View>
            </View>

            <View
              className={`${bg.card} rounded-2xl p-4 ${isDark ? "shadow-lg" : "shadow-md"}`}
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
              <View className="flex-row items-start mb-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#F59E0B20" }}
                >
                  <Feather name="alert-circle" size={16} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary} mb-1`}>
                    App travando ou lento?
                  </Text>
                  <Text className={`text-sm ${text.muted} leading-5`}>
                    Tente fechar e abrir o app novamente. Se o problema persistir, limpe o cache nas configurações.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Contato Rápido */}
        <View className="px-5 mt-6">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Fale Conosco
          </Text>
          <View className="gap-3">
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.action}
                className={`${bg.card} rounded-2xl p-4 flex-row items-center ${
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
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <Feather name={option.icon} size={24} color={option.color} />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold ${text.primary}`}>
                    {option.title}
                  </Text>
                  <Text className={`text-sm ${text.muted} mt-0.5`}>
                    {option.subtitle}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={isDark ? "#64748B" : "#CBD5E1"} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informações de Atendimento */}
        <View className="px-5 mt-6 mb-8">
          <Text className={`text-xs font-bold ${text.muted} uppercase tracking-wide mb-3`}>
            Horário de Atendimento
          </Text>
          <View
            className={`${bg.card} rounded-2xl p-4 ${isDark ? "shadow-lg" : "shadow-md"}`}
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
            <View className="flex-row items-center mb-3">
              <Feather name="clock" size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text className={`text-base font-bold ${text.primary} ml-3`}>
                Segunda a Sexta
              </Text>
            </View>
            <Text className={`text-sm ${text.muted} mb-3`}>
              Das 8h às 18h
            </Text>
            
            <View className="flex-row items-center mb-3 pt-3 border-t" style={{ borderColor: isDark ? colors.border : "#E5E7EB" }}>
              <Feather name="mail" size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text className={`text-base font-bold ${text.primary} ml-3`}>
                Email
              </Text>
            </View>
            <Text className={`text-sm ${text.muted}`}>
              Resposta em até 24 horas úteis
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
