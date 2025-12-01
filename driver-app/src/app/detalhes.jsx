import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useMemo } from "react";
import { useActiveTravel } from "@/src/contexts/ActiveTravelContext";
import { useUsers } from "@/src/hooks/useUsers";
import { useTravels } from "@/src/hooks/useTravels";
import { useAmbulance } from "@/src/hooks/useAmbulance";
import travelService from "@/src/services/travel";
import { formatarDataHora } from "@/src/lib/date-utils";
import { getTravelStatusLabel, TravelStatus } from "@/src/lib/travel-status";
import {
  validateTravelAcceptance,
  validateAmbulanceForTravel,
} from "@/src/lib/travel-validation";
import {
  formatCPF,
  formatPhone,
  formatarEndereco,
} from "@/src/lib/format-utils";
import ConfirmModal from "@/src/components/ConfirmModal";
import { ThemedCard, ThemedText, ThemedView } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

export default function DetalhesViagem() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useThemeStyles();
  const { setActiveTravel, clearActiveTravel, hasActiveTravel } =
    useActiveTravel();
  const { travels: todasViagens } = useTravels();
  const { ambulance } = useAmbulance();

  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const pacienteIds = useMemo(() => {
    return viagem?.id_paciente ? [viagem.id_paciente] : [];
  }, [viagem?.id_paciente]);

  const { users } = useUsers(pacienteIds);

  useEffect(() => {
    if (!id) {
      setError("ID da viagem não fornecido");
      setLoading(false);
      return;
    }

    const fetchViagem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await travelService.getTravelById(id);
        setViagem(data);
      } catch (err) {
        console.error("Erro ao buscar viagem:", err);
        setError(err.message || "Erro ao carregar viagem");
      } finally {
        setLoading(false);
      }
    };

    fetchViagem();
  }, [id]);

  const paciente = useMemo(() => {
    if (!viagem?.id_paciente) return null;
    const cached = users.get(viagem.id_paciente);
    return cached?.user || null;
  }, [viagem?.id_paciente, users]);

  const statusLabel = viagem ? getTravelStatusLabel(viagem.realizado) : null;

  const handleStartTravel = () => {
    if (viagem) {
      const validation = validateTravelAcceptance(
        viagem,
        todasViagens,
        hasActiveTravel()
      );

      if (!validation.canAccept) {
        Alert.alert("Atenção", validation.message);
        return;
      }

      const ambulanceValidation = validateAmbulanceForTravel(ambulance);
      if (!ambulanceValidation.canAccept) {
        Alert.alert("Bloqueio", ambulanceValidation.message);
        return;
      }
    }

    setShowStartConfirm(true);
  };

  const confirmStart = async () => {
    try {
      setShowStartConfirm(false);
      await travelService.startTravel(id);
      const data = await travelService.getTravelById(id);
      setViagem(data);
      setActiveTravel(id);

      navigation.navigate("Navegacao", { id });
    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao iniciar viagem");
    }
  };

  const handleEndTravel = () => {
    setShowEndConfirm(true);
  };

  const confirmEnd = async () => {
    try {
      setShowEndConfirm(false);
      await travelService.endTravel(id);
      const data = await travelService.getTravelById(id);
      setViagem(data);
      clearActiveTravel();
      Alert.alert("Sucesso", "Viagem finalizada com sucesso!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao finalizar viagem");
    }
  };

  if (loading) {
    return (
      <ThemedView
        variant="secondary"
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={isDark ? colors.primary : "#3B82F6"}
          />
          <ThemedText variant="muted" className="mt-4">
            Carregando viagem...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !viagem) {
    return (
      <ThemedView
        variant="secondary"
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
        />
        <View className="px-5 pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Feather
              name="arrow-left"
              size={24}
              color={isDark ? colors.foreground : "#1F2937"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Feather name="alert-circle" size={48} color={colors.error} />
          <ThemedText
            variant="primary"
            className="text-xl font-bold mt-4 text-center"
          >
            {error || "Viagem não encontrada"}
          </ThemedText>
          <ThemedText variant="muted" className="mt-2 text-center">
            Não foi possível carregar os detalhes da viagem.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      variant="secondary"
      className="flex-1"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ThemedView variant="card" className="px-5 pt-4 pb-4 border-b">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Feather
                name="arrow-left"
                size={24}
                color={isDark ? colors.foreground : "#1F2937"}
              />
            </TouchableOpacity>
            <View className="flex-1">
              <ThemedText variant="primary" className="text-xl font-bold">
                Detalhes da Viagem
              </ThemedText>
              <ThemedText variant="muted" className="text-xs font-mono mt-1">
                {id}
              </ThemedText>
            </View>
            {statusLabel && (
              <View
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor:
                    viagem.realizado === TravelStatus.REALIZADO
                      ? "#22C55E"
                      : viagem.realizado === TravelStatus.EM_PROGRESSO
                        ? "#3B82F6"
                        : "#F59E0B",
                }}
              >
                <Text className="text-white text-xs font-semibold">
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>
        </ThemedView>

        <View className="px-5 pt-6 pb-6">
          <ThemedCard className="rounded-2xl p-5 mb-4">
            <ThemedText variant="primary" className="text-lg font-bold mb-4">
              Informações da Viagem
            </ThemedText>

            <View className="space-y-4">
              <View className="flex-row items-start">
                <Feather
                  name="map-pin"
                  size={18}
                  color={isDark ? colors.primary : "#3B82F6"}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <ThemedText variant="muted" className="text-xs mb-1">
                    Origem
                  </ThemedText>
                  <ThemedText
                    variant="primary"
                    className="text-sm font-semibold"
                  >
                    {formatarEndereco(viagem.end_inicio)}
                  </ThemedText>
                </View>
              </View>

              <View className="flex-row items-start">
                <Feather
                  name="flag"
                  size={18}
                  color={colors.success}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <ThemedText variant="muted" className="text-xs mb-1">
                    Destino
                  </ThemedText>
                  <ThemedText
                    variant="primary"
                    className="text-sm font-semibold"
                  >
                    {formatarEndereco(viagem.end_fim)}
                  </ThemedText>
                </View>
              </View>

              <View className="flex-row items-start">
                <Feather
                  name="calendar"
                  size={18}
                  color={isDark ? colors.primary : "#9333EA"}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <ThemedText variant="muted" className="text-xs mb-1">
                    Data e Horário
                  </ThemedText>
                  <ThemedText
                    variant="primary"
                    className="text-sm font-semibold"
                  >
                    {formatarDataHora(viagem.inicio)}
                  </ThemedText>
                  {viagem.fim && (
                    <ThemedText variant="muted" className="text-xs mt-1">
                      Finalização: {formatarDataHora(viagem.fim)}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          </ThemedCard>

          <ThemedCard className="rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-4">
              <View
                className="p-2 rounded-full mr-3"
                style={{
                  backgroundColor: isDark ? `${colors.primary}20` : "#DBEAFE",
                }}
              >
                <Feather
                  name="user"
                  size={20}
                  color={isDark ? colors.primary : "#3B82F6"}
                />
              </View>
              <ThemedText variant="primary" className="text-lg font-bold">
                Paciente
              </ThemedText>
            </View>

            {paciente ? (
              <View className="space-y-3">
                <View>
                  <ThemedText variant="muted" className="text-xs mb-1">
                    Nome
                  </ThemedText>
                  <ThemedText
                    variant="primary"
                    className="text-base font-semibold"
                  >
                    {paciente.nome || "Não informado"}
                  </ThemedText>
                </View>
                {viagem.cpf_paciente && (
                  <View>
                    <ThemedText variant="muted" className="text-xs mb-1">
                      CPF
                    </ThemedText>
                    <ThemedText
                      variant="primary"
                      className="text-sm font-semibold"
                    >
                      {formatCPF(viagem.cpf_paciente)}
                    </ThemedText>
                  </View>
                )}
                {paciente.email && (
                  <View>
                    <ThemedText variant="muted" className="text-xs mb-1">
                      Email
                    </ThemedText>
                    <ThemedText
                      variant="primary"
                      className="text-sm font-semibold"
                    >
                      {paciente.email}
                    </ThemedText>
                  </View>
                )}
                {paciente.telefone && (
                  <View>
                    <ThemedText variant="muted" className="text-xs mb-1">
                      Telefone
                    </ThemedText>
                    <ThemedText
                      variant="primary"
                      className="text-sm font-semibold"
                    >
                      {formatPhone(paciente.telefone)}
                    </ThemedText>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-4">
                <Feather
                  name="user-x"
                  size={32}
                  color={isDark ? colors.foregroundMuted : "#9CA3AF"}
                />
                <ThemedText variant="muted" className="text-sm mt-2">
                  Carregando dados do paciente...
                </ThemedText>
              </View>
            )}

            {viagem.observacoes && (
              <View
                className="mt-4 pt-4 border-t"
                style={{ borderColor: isDark ? colors.border : "#E5E7EB" }}
              >
                <ThemedText variant="muted" className="text-xs mb-1">
                  Observações
                </ThemedText>
                <ThemedText variant="primary" className="text-sm">
                  {viagem.observacoes}
                </ThemedText>
              </View>
            )}
          </ThemedCard>

          {viagem.id_ambulancia && (
            <ThemedCard className="rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <View
                  className="p-2 rounded-full mr-3"
                  style={{
                    backgroundColor: isDark ? `${colors.success}20` : "#D1FAE5",
                  }}
                >
                  <Feather name="truck" size={20} color={colors.success} />
                </View>
                <ThemedText variant="primary" className="text-lg font-bold">
                  Ambulância
                </ThemedText>
              </View>
              <ThemedText variant="muted" className="text-xs mb-1">
                ID
              </ThemedText>
              <ThemedText
                variant="primary"
                className="text-sm font-semibold font-mono"
              >
                {viagem.id_ambulancia}
              </ThemedText>
            </ThemedCard>
          )}

          <View className="space-y-3">
            {viagem.realizado === TravelStatus.NAO_REALIZADO && (
              <TouchableOpacity
                onPress={handleStartTravel}
                className="bg-blue-600 rounded-xl py-4 items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-base">
                  Iniciar Viagem
                </Text>
              </TouchableOpacity>
            )}

            {viagem.realizado === TravelStatus.EM_PROGRESSO && (
              <TouchableOpacity
                onPress={handleEndTravel}
                className="bg-green-600 rounded-xl py-4 items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-base">
                  Finalizar Viagem
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showStartConfirm}
        title="Iniciar Viagem"
        message="Deseja iniciar o transporte deste paciente? Certifique-se de que todos os protocolos foram seguidos."
        onConfirm={confirmStart}
        onCancel={() => setShowStartConfirm(false)}
        confirmText="Iniciar"
        type="info"
      />

      <ConfirmModal
        visible={showEndConfirm}
        title="Finalizar Viagem"
        message="Deseja finalizar esta viagem? Esta ação confirmará a chegada ao destino."
        onConfirm={confirmEnd}
        onCancel={() => setShowEndConfirm(false)}
        confirmText="Finalizar"
        type="success"
      />
    </ThemedView>
  );
}
