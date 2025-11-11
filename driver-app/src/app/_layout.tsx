import '@/src/styles/global.css';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
const Routes = React.lazy(() => import('./routes'));

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#000" />
        <Suspense
          fallback={
            <ActivityIndicator
              color="#3B82F6"
              size="large"
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            />
          }
        >
          <Routes />
        </Suspense>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
