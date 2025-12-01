import { useNavigation } from '@react-navigation/native';
import { Car, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { ThemedView, ThemedText } from "../components";
import { useThemeStyles } from "../hooks/useThemeStyles";

export default function Login() {
  const navigation = useNavigation();
  const {
    login,
    isAuthLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();
  const { isDark, bg, text, colors } = useThemeStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (authError) clearError();
      await login(email, password);
    } catch (err) {
      console.warn("Erro no login:", err?.message || err);
    }
  };

  return (
    <ThemedView variant="secondary" className="flex-1" style={{ backgroundColor: isDark ? colors.backgroundSecondary : "#EFF6FF" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0F172A" : "#EFF6FF"} />
      <LoadingOverlay visible={authLoading} message="Autenticando..." />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-8 justify-between">
            <View>
              <View className="items-center mb-12 mt-8">
                <View className="w-24 h-24 rounded-3xl items-center justify-center shadow-2xl mb-6" style={{ backgroundColor: isDark ? colors.primary : "#3B82F6" }}>
                  <Car size={48} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <ThemedText variant="primary" className="text-5xl font-bold mb-3">
                  SGA
                </ThemedText>
                <ThemedText variant="muted" className="text-lg">
                  Sistema SGA do Motorista
                </ThemedText>
              </View>

              <ThemedView variant="card" className="rounded-3xl shadow-2xl p-8 border">
                <ThemedText variant="primary" className="text-2xl font-bold mb-2">
                  Entrar na Plataforma
                </ThemedText>
                {!!authError && (
                  <Text className="text-red-500 mb-4">{authError}</Text>
                )}

                <View className="mb-5">
                  <ThemedText variant="secondary" className="text-sm font-semibold mb-2">
                    Email
                  </ThemedText>
                  <TextInput
                    value={email}
                    onChangeText={(v) => {
                      if (authError) clearError();
                      setEmail(v);
                    }}
                    placeholder="seu@email.com"
                    placeholderTextColor={isDark ? colors.foregroundMuted : "#94A3B8"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full px-4 py-4 rounded-xl"
                    style={{
                      backgroundColor: isDark ? colors.input : "#F1F5F9",
                      borderWidth: 1,
                      borderColor: isDark ? colors.border : "#E2E8F0",
                      color: isDark ? colors.foreground : "#1E293B",
                    }}
                  />
                </View>

                <View className="mb-6">
                  <ThemedText variant="secondary" className="text-sm font-semibold mb-2">
                    Senha
                  </ThemedText>
                  <View className="relative">
                    <TextInput
                      value={password}
                      onChangeText={(v) => {
                        if (authError) clearError();
                        setPassword(v);
                      }}
                      placeholder="Sua senha"
                      placeholderTextColor={isDark ? colors.foregroundMuted : "#94A3B8"}
                      secureTextEntry={!showPassword}
                      className="w-full px-4 py-4 pr-12 rounded-xl"
                      style={{
                        backgroundColor: isDark ? colors.input : "#F1F5F9",
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : "#E2E8F0",
                        color: isDark ? colors.foreground : "#1E293B",
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4"
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={isDark ? colors.foregroundMuted : "#94A3B8"} />
                      ) : (
                        <Eye size={20} color={isDark ? colors.foregroundMuted : "#94A3B8"} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={authLoading}
                  className="w-full py-4 rounded-xl items-center justify-center shadow-sm"
                  style={{ backgroundColor: isDark ? colors.primary : "#3B82F6" }}
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-bold text-base">
                    Entrar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Termos")}
                  className="mt-6"
                  activeOpacity={0.7}
                >
                  <ThemedText variant="muted" className="text-xs text-center">
                    Ao entrar, você concorda com nossos{" "}
                    <Text
                      className="underline font-semibold"
                      style={{ color: isDark ? colors.primary : "#3B82F6" }}
                      onPress={() => navigation.navigate("Termos")}
                    >
                      Termos de Uso
                    </Text>
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
