import { useAuth } from '@/src/hooks/useAuth';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Login from '../screens/login';
import TabRoutes from './tabs.route';

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
    </Stack.Navigator>
  );
}
