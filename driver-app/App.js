import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ActiveTravelProvider } from "./src/contexts/ActiveTravelContext";
import { PreferencesProvider } from "./src/contexts/PreferencesContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import Routes from "./src/routes";
import ErrorBoundary from "./src/components/ErrorBoundary";

import "./src/styles/global.css";

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <AuthProvider>
            <ActiveTravelProvider>
              <PreferencesProvider>
                <ThemeProvider>
                  <Routes />
                </ThemeProvider>
              </PreferencesProvider>
            </ActiveTravelProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
