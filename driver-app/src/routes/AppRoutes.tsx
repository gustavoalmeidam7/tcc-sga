import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStyles } from "@/hooks/useThemeStyles";

import Home from "../screens/home";
import Viagens from "../screens/viagens";
import Ambulancias from "../screens/ambulancias";


import Mais from "../screens/mais";
import Detalhes from "../screens/detalhes";
import Navegacao from "../screens/navegacao";
import Perfil from "../screens/perfil";
import Termos from "../screens/termos";
import Configuracoes from "../screens/configuracoes";
import Suporte from "../screens/suporte";
import Sobre from "../screens/sobre";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useThemeStyles();

  const TAB_HEIGHT = 60;
  const bottomPadding =
    Platform.OS === "android" ? insets.bottom : insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? colors.primary : "#3B82F6",
        tabBarInactiveTintColor: isDark ? colors.foregroundMuted : "#6B7280",
        tabBarStyle: {
          backgroundColor: isDark ? colors.card : "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.border : "#E5E7EB",
          height: TAB_HEIGHT + bottomPadding,
          paddingTop: 4,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowColor: isDark ? "#000" : "#000",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ViagensTab"
        component={Viagens}
        options={{
          title: "Atividade",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ambulancias"
        component={Ambulancias}
        options={{
          title: "Ambulancia",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="ambulance"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mais"
        component={Mais}
        options={{
          title: "Mais",
          tabBarIcon: ({ color, size }) => (
            <Feather name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen name="Detalhes" component={Detalhes} />
      <Stack.Screen
        name="Navegacao"
        component={Navegacao}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Termos" component={Termos} />
      <Stack.Screen name="Configuracoes" component={Configuracoes} />
      <Stack.Screen name="Suporte" component={Suporte} />
      <Stack.Screen name="Sobre" component={Sobre} />
    </Stack.Navigator>
  );
}
