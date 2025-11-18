import { useAuth } from '@/src/hooks/useAuth';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Login from '../screens/login';
import TabRoutes from './tabs.route';
import Perfil from "@/src/app/screens/perfil"
import Termos from "@/src/app/screens/termos"
import DetalhesViagem from "@/src/app/screens/detalhes"

const Stack = createStackNavigator();

export default function Routes() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? 'Tabs' : 'Login'}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Termos" component={Termos} />
      <Stack.Screen name="DetalhesViagem" component={DetalhesViagem} />
    </Stack.Navigator>
  );
}
