import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Termos() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-light-background-secondary"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View className="px-5 pt-6 pb-4 bg-light-background-secondary">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-3 w-10 h-10 items-center justify-center"
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-light-foreground">
              Termos e Condições
            </Text>
            <Text className="text-sm text-light-foreground-muted mt-1">
              Políticas de uso e privacidade
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-4">
          <View className="bg-light-card rounded-2xl p-6 border border-light-border mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-xl bg-light-primary/10 items-center justify-center mr-3">
                <Feather name="file-text" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-light-foreground">
                  Termos e Condições Gerais de Uso
                </Text>
                <Text className="text-xs text-light-foreground-muted mt-1">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-light-card rounded-2xl p-6 border border-light-border">
            <Text className="text-base font-bold text-light-foreground mb-4">
              1. Aceitação dos Termos
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Ao acessar e utilizar o aplicativo SGA (Sistema de Gerenciamento
              de Ambulâncias), você concorda em cumprir e estar vinculado aos
              seguintes termos e condições de uso. Se você não concorda com
              alguma parte destes termos, não deve utilizar o aplicativo.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              2. Descrição do Serviço
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              O SGA é uma plataforma desenvolvida para gerenciar e coordenar
              serviços de transporte em ambulâncias, permitindo que motoristas,
              gestores e outros usuários autorizados gerenciem viagens,
              ambulâncias e informações relacionadas ao serviço.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              3. Uso do Aplicativo
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Você concorda em utilizar o aplicativo apenas para fins legais e
              de acordo com estes termos. É proibido utilizar o aplicativo de
              forma que possa danificar, desabilitar, sobrecarregar ou
              comprometer nossos servidores ou redes.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              4. Conta de Usuário
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Para utilizar determinadas funcionalidades do aplicativo, você
              precisará criar uma conta. Você é responsável por manter a
              confidencialidade de suas credenciais de acesso e por todas as
              atividades que ocorram sob sua conta.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              5. Privacidade e Proteção de Dados
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Respeitamos sua privacidade e nos comprometemos a proteger seus
              dados pessoais. As informações coletadas são utilizadas
              exclusivamente para fornecer e melhorar nossos serviços, em
              conformidade com a legislação vigente sobre proteção de dados.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              6. Responsabilidades do Usuário
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Você é responsável por fornecer informações precisas e
              atualizadas. Não deve compartilhar sua conta com terceiros ou
              utilizar o aplicativo para atividades fraudulentas ou ilegais.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              7. Limitação de Responsabilidade
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              O aplicativo é fornecido "como está", sem garantias de qualquer
              tipo. Não nos responsabilizamos por danos diretos, indiretos,
              incidentais ou consequenciais resultantes do uso ou incapacidade
              de usar o aplicativo.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              8. Modificações nos Termos
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Reservamos o direito de modificar estes termos a qualquer momento.
              As alterações entrarão em vigor imediatamente após a publicação. O
              uso continuado do aplicativo após as alterações constitui sua
              aceitação dos novos termos.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              9. Propriedade Intelectual
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Todo o conteúdo do aplicativo, incluindo textos, gráficos, logos,
              ícones e software, é propriedade do SGA ou de seus licenciadores e
              está protegido por leis de direitos autorais e outras leis de
              propriedade intelectual.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              10. Rescisão
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Reservamos o direito de suspender ou encerrar sua conta e acesso
              ao aplicativo, a nosso critério, sem aviso prévio, por violação
              destes termos ou por qualquer outro motivo que consideremos
              apropriado.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              11. Lei Aplicável
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6 mb-6">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa
              relacionada a estes termos será resolvida nos tribunais
              competentes do Brasil.
            </Text>

            <Text className="text-base font-bold text-light-foreground mb-4">
              12. Contato
            </Text>
            <Text className="text-sm text-light-foreground-muted leading-6">
              Se você tiver dúvidas sobre estes termos, entre em contato conosco
              através dos canais de suporte disponíveis no aplicativo.
            </Text>
          </View>

          <View className="bg-light-primary/10 rounded-2xl p-5 mt-4 border border-light-primary/20">
            <View className="flex-row items-start">
              <View className="mr-3 mt-0.5">
                <Feather name="info" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-light-foreground mb-2">
                  Importante
                </Text>
                <Text className="text-xs text-light-foreground-muted leading-5">
                  Ao utilizar este aplicativo, você confirma que leu,
                  compreendeu e concorda com todos os termos e condições aqui
                  apresentados. Recomendamos que você revise estes termos
                  periodicamente para estar ciente de quaisquer alterações.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
