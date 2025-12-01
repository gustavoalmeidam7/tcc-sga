import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedCard, ThemedText, ThemedView } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export default function Termos() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, colors } = useThemeStyles();

  return (
    <ThemedView variant="secondary" className="flex-1" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0F172A" : "#FFFFFF"} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ThemedView variant="card" className="px-5 pt-4 pb-4 border-b shadow-sm">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Feather name="arrow-left" size={24} color={isDark ? colors.foreground : "#1F2937"} />
            </TouchableOpacity>
            <View className="flex-1">
              <ThemedText variant="primary" className="text-xl font-bold">
                Termos e Condições
              </ThemedText>
              <ThemedText variant="muted" className="text-sm mt-1">
                Política de uso e privacidade
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <View className="px-5 pt-6 pb-6">
          <ThemedCard className="rounded-2xl p-6">
            <ThemedText variant="primary" className="text-lg font-bold mb-4">
              Termos de Uso - SGA Motorista
            </ThemedText>

            <ThemedText variant="secondary" className="text-sm leading-6 mb-6">
              Bem-vindo ao Sistema de Gerenciamento de Ambulâncias (SGA) para Motoristas.
              Ao utilizar este aplicativo, você concorda com os seguintes termos e condições:
            </ThemedText>

            <View className="space-y-4">
              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  1. Uso do Aplicativo
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  Este aplicativo é destinado exclusivamente para motoristas autorizados do sistema SGA.
                  É proibido compartilhar credenciais de acesso ou utilizar o aplicativo para fins não autorizados.
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  2. Responsabilidades
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  Os motoristas são responsáveis por:
                  {"\n"}• Manter suas credenciais de acesso seguras
                  {"\n"}• Reportar imediatamente qualquer atividade suspeita
                  {"\n"}• Utilizar o GPS apenas durante viagens autorizadas
                  {"\n"}• Manter a confidencialidade dos dados dos pacientes
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  3. Privacidade de Dados
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  Seus dados pessoais e informações de localização são coletados apenas para fins operacionais
                  do sistema SGA. Todas as informações são protegidas conforme a Lei Geral de Proteção de Dados (LGPD).
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  4. Segurança
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  É responsabilidade do motorista garantir que o dispositivo utilizado atenda aos requisitos de segurança,
                  incluindo atualizações de sistema e proteção contra malware.
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  5. Uso de GPS
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  O sistema de GPS é utilizado exclusivamente para rastreamento de viagens autorizadas.
                  O uso indevido do GPS pode resultar em suspensão ou cancelamento do acesso.
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  6. Suporte
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  Para suporte técnico ou dúvidas sobre o uso do aplicativo,
                  entre em contato com o administrador do sistema SGA.
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  7. Atualizações
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  O aplicativo pode ser atualizado periodicamente. Os motoristas são responsáveis por manter
                  o aplicativo atualizado para garantir o funcionamento adequado.
                </ThemedText>
              </View>

              <View>
                <ThemedText variant="primary" className="text-base font-semibold mb-2">
                  8. Violação dos Termos
                </ThemedText>
                <ThemedText variant="secondary" className="text-sm leading-6">
                  A violação destes termos pode resultar em suspensão temporária ou permanente do acesso
                  ao sistema SGA, além de outras medidas administrativas apropriadas.
                </ThemedText>
              </View>
            </View>

            <View className="mt-6 pt-4 border-t" style={{ borderColor: isDark ? colors.border : "#E5E7EB" }}>
              <ThemedText variant="muted" className="text-xs text-center">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </ThemedText>
              <ThemedText variant="muted" className="text-xs text-center mt-1">
                Versão do aplicativo: 1.0.0
              </ThemedText>
            </View>
          </ThemedCard>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-full rounded-xl py-4 items-center justify-center mt-6 shadow-sm"
            style={{ backgroundColor: isDark ? colors.primary : "#2563EB" }}
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-base">
              Entendi e Concordo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
