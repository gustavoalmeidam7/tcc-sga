import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useMemo } from "react";
import { useUsers } from "@/src/hooks/useUsers";
import travelService from "@/src/services/travel";
import {
  formatarDataHora,
  formatarData,
  formatarHora,
} from "@/src/lib/date-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
} from "@/src/lib/travel-status";
import { TravelStatus } from "@/src/lib/travel-status";
import { formatCPF, formatPhone } from "@/src/lib/format-utils";

export default function DetalhesViagem() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};

  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pacienteIds = useMemo(() => {
    return viagem?.id_paciente ? [viagem.id_paciente] : [];
  }, [viagem?.id_paciente]);

  const { getUser, users } = useUsers(pacienteIds);

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

  const statusColors = viagem ? getTravelStatusColors(viagem.realizado) : null;
  const statusLabel = viagem ? getTravelStatusLabel(viagem.realizado) : null;

  const handleStartTravel = () => {
    Alert.alert("Iniciar Viagem", "Deseja iniciar esta viagem?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Iniciar",
        style: "default",
        onPress: async () => {
          try {
            await travelService.startTravel(id);
            const data = await travelService.getTravelById(id);
            setViagem(data);
            Alert.alert("Sucesso", "Viagem iniciada com sucesso!");
          } catch (err) {
            Alert.alert("Erro", err.message || "Erro ao iniciar viagem");
          }
        },
      },
    ]);
  };

  const handleEndTravel = () => {
    Alert.alert("Finalizar Viagem", "Deseja finalizar esta viagem?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Finalizar",
        style: "default",
        onPress: async () => {
          try {
            await travelService.endTravel(id);
            const data = await travelService.getTravelById(id);
            setViagem(data);
            Alert.alert("Sucesso", "Viagem finalizada com sucesso!");
          } catch (err) {
            Alert.alert("Erro", err.message || "Erro ao finalizar viagem");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Carregando viagem...</Text>
        </View>
      </View>
    );
  }

  if (error || !viagem) {
    return (
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View className="px-5 pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
            {error || "Viagem não encontrada"}
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Não foi possível carregar os detalhes da viagem.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Feather name="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                Detalhes da Viagem
              </Text>
              <Text className="text-xs text-gray-500 font-mono mt-1">{id}</Text>
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
        </View>

        <View className="px-5 pt-6 pb-6">
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Informações da Viagem
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-start">
                <Feather
                  name="map-pin"
                  size={18}
                  color="#3B82F6"
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Origem</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {viagem.end_inicio || "Não informado"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Feather
                  name="flag"
                  size={18}
                  color="#22C55E"
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Destino</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {viagem.end_fim || "Não informado"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Feather
                  name="calendar"
                  size={18}
                  color="#9333EA"
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">
                    Data e Horário
                  </Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {formatarDataHora(viagem.inicio)}
                  </Text>
                  {viagem.fim && (
                    <Text className="text-xs text-gray-500 mt-1">
                      Finalização: {formatarDataHora(viagem.fim)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <Feather name="user" size={20} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Paciente</Text>
            </View>

            {paciente ? (
              <View className="space-y-3">
                <View>
                  <Text className="text-xs text-gray-500 mb-1">Nome</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {paciente.nome || "Não informado"}
                  </Text>
                </View>
                {viagem.cpf_paciente && (
                  <View>
                    <Text className="text-xs text-gray-500 mb-1">CPF</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {formatCPF(viagem.cpf_paciente)}
                    </Text>
                  </View>
                )}
                {paciente.email && (
                  <View>
                    <Text className="text-xs text-gray-500 mb-1">Email</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {paciente.email}
                    </Text>
                  </View>
                )}
                {paciente.telefone && (
                  <View>
                    <Text className="text-xs text-gray-500 mb-1">Telefone</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {formatPhone(paciente.telefone)}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-4">
                <Feather name="user-x" size={32} color="#9CA3AF" />
                <Text className="text-sm text-gray-500 mt-2">
                  Carregando dados do paciente...
                </Text>
              </View>
            )}

            {viagem.observacoes && (
              <View className="mt-4 pt-4 border-t border-gray-200">
                <Text className="text-xs text-gray-500 mb-1">Observações</Text>
                <Text className="text-sm text-gray-900">
                  {viagem.observacoes}
                </Text>
              </View>
            )}
          </View>

          {viagem.id_ambulancia && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-green-100 p-2 rounded-full mr-3">
                  <Feather name="truck" size={20} color="#22C55E" />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  Ambulância
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mb-1">ID</Text>
              <Text className="text-sm font-semibold text-gray-900 font-mono">
                {viagem.id_ambulancia}
              </Text>
            </View>
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
    </View>
  );
}
