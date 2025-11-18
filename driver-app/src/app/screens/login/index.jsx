import { useAuth } from "@/src/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { Car, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const {
    login,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (authError) clearError();
      await login(email, password);
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (err) {
      console.warn("Erro no login:", err?.message || err);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100">
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
                <View className="w-24 h-24 bg-light-primary rounded-3xl items-center justify-center shadow-2xl mb-6">
                  <Car size={48} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text className="text-5xl font-bold text-light-foreground mb-3">
                  SGA
                </Text>
                <Text className="text-light-foreground-muted text-lg">
                  Sistema SGA do Motorista
                </Text>
              </View>

              <View className="bg-light-card border border-light-border rounded-3xl shadow-2xl p-8">
                <Text className="text-2xl font-bold text-light-foreground mb-2">
                  Entrar na Plataforma
                </Text>
                {!!authError && (
                  <Text className="text-red-500 mb-4">{authError}</Text>
                )}

                <View className="mb-5">
                  <Text className="text-light-foreground-secondary text-sm font-semibold mb-2">
                    Email
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={(v) => {
                      if (authError) clearError();
                      setEmail(v);
                    }}
                    placeholder="seu@email.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full px-4 py-4 bg-light-input border border-light-border text-light-foreground rounded-xl"
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-light-foreground-secondary text-sm font-semibold mb-2">
                    Senha
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={password}
                      onChangeText={(v) => {
                        if (authError) clearError();
                        setPassword(v);
                      }}
                      placeholder="••••••••"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPassword}
                      className="w-full px-4 py-4 bg-light-input border border-light-border text-light-foreground rounded-xl"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ transform: [{ translateY: -12 }] }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#64748B" />
                      ) : (
                        <Eye size={20} color="#64748B" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-6" />

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={authLoading}
                  className={`w-full py-4 rounded-xl shadow-lg active:opacity-80 ${authLoading ? "bg-blue-300" : "bg-light-primary"}`}
                >
                  {authLoading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator
                        color="#fff"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-center text-white font-bold text-lg">
                        Entrando...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center text-white font-bold text-lg">
                      Entrar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-center mt-8 mb-4">
              <Text className="text-xs text-light-foreground-muted text-center">
                Ao entrar, você concorda com nossos{" "}
                <Text 
                  className="underline text-light-primary font-semibold"
                  onPress={() => navigation.navigate("Termos")}
                >
                  Termos de Uso
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
