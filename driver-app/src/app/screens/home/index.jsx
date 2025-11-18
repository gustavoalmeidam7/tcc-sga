import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/hooks/useAuth";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTravels } from "@/src/hooks/useTravels";
import { useUsers } from "@/src/hooks/useUsers";
import { formatarHora } from "@/src/lib/date-utils";
import { TravelStatus } from "@/src/lib/travel-status";

const StatsCard = ({ icon, title, value, iconColor, bgColor }) => (
  <View className="bg-white rounded-xl p-4 flex-1 items-center justify-center shadow-md">
    <View
      className="p-2 rounded-full"
      style={{ backgroundColor: bgColor + "20" }}
    >
      <Feather name={icon} size={18} color={iconColor} />
    </View>
    <Text className="text-2xl font-bold mt-2 text-gray-900">{value}</Text>
    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">
      {title}
    </Text>
  </View>
);

const ViagemEmAndamento = ({ viagem, pacienteNome, onPressDetalhes }) => (
  <View
    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-xl mt-6"
    style={{ backgroundColor: "#2563EB" }}
  >
    <View className="flex-row items-center mb-4">
      <View className="bg-white/20 p-2 rounded-full">
        <Feather name="navigation" size={22} color="white" />
      </View>
      <Text className="text-white text-lg font-bold ml-3">
        Viagem em Andamento
      </Text>
    </View>
    <Text className="text-white text-2xl font-bold mb-3">
      {pacienteNome ? `Paciente ${pacienteNome}` : "Paciente não informado"}
    </Text>
    <View className="mb-5 space-y-2">
      <View className="flex-row items-start">
        <Feather
          name="map-pin"
          size={16}
          color="#DBEAFE"
          style={{ marginTop: 2, marginRight: 8 }}
        />
        <Text className="text-blue-100 text-sm flex-1">
          {viagem.end_inicio}
        </Text>
      </View>
      <View className="flex-row items-start">
        <Feather
          name="flag"
          size={16}
          color="#DBEAFE"
          style={{ marginTop: 2, marginRight: 8 }}
        />
        <Text className="text-blue-100 text-sm flex-1">{viagem.end_fim}</Text>
      </View>
    </View>
    <View className="flex-row gap-3">
      <TouchableOpacity
        className="flex-1 bg-white/95 rounded-xl py-3.5 items-center justify-center shadow-sm"
        activeOpacity={0.7}
        onPress={onPressDetalhes}
      >
        <Text className="text-blue-600 font-bold text-base">Ver Detalhes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 bg-green-500 rounded-xl py-3.5 items-center justify-center shadow-sm"
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold text-base">Finalizar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ViagensHoje = ({ viagens, getUserName, onPressViagem }) => (
  <View className="mt-6">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-xl font-bold text-gray-900">
        Agendadas para Hoje
      </Text>
      <View className="bg-blue-100 px-3 py-1 rounded-full">
        <Text className="text-blue-600 font-bold text-xs">
          {viagens.length}
        </Text>
      </View>
    </View>
    {viagens.map((viagem, index) => {
      const horario = formatarHora(viagem.inicio);
      const [hora, minuto] = horario.split(":");
      const statusText =
        viagem.realizado === TravelStatus.EM_PROGRESSO
          ? "Em andamento"
          : "Agendada";

      return (
        <TouchableOpacity
          key={viagem.id}
          className="bg-white rounded-2xl p-5 mb-3 shadow-md flex-row items-center"
          activeOpacity={0.7}
          onPress={() => onPressViagem(viagem.id)}
        >
          <View className="bg-blue-50 rounded-xl px-4 py-3 mr-4 items-center justify-center">
            <Text className="text-sm font-semibold text-blue-600">{hora}</Text>
            <Text className="text-xs font-bold text-blue-400">{minuto}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 mb-1">
              {getUserName(viagem.id_paciente)
                ? `Paciente ${getUserName(viagem.id_paciente)}`
                : "Paciente não informado"}
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
              <Text className="text-sm text-gray-500">{statusText}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={22} color="#D1D5DB" />
        </TouchableOpacity>
      );
    })}
  </View>
);

const EmptyState = ({ icon, title, description }) => (
  <View className="bg-white rounded-3xl p-8 items-center mt-6">
    <View className="bg-gray-100 p-5 rounded-full mb-4">
      <MaterialCommunityIcons name={icon} size={48} color="#9CA3AF" />
    </View>
    <Text className="text-lg font-bold text-gray-800 text-center mb-2">
      {title}
    </Text>
    <Text className="text-sm text-gray-500 text-center leading-5">
      {description}
    </Text>
  </View>
);

export default function Home() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { travels, loading, error, fetchTravels, getTravelStats } =
    useTravels();
  const {
    viagensAtribuidas,
    viagensConcluidasHoje,
    viagemEmAndamento,
    viagensHoje,
  } = getTravelStats();

  const pacienteIds = useMemo(() => {
    const ids = new Set();
    if (viagemEmAndamento?.id_paciente) {
      ids.add(viagemEmAndamento.id_paciente);
    }
    viagensHoje.forEach((v) => {
      if (v.id_paciente) {
        ids.add(v.id_paciente);
      }
    });
    return Array.from(ids);
  }, [viagemEmAndamento, viagensHoje]);

  const { getUserName } = useUsers(pacienteIds);

  const pacienteNomeEmAndamento = useMemo(() => {
    if (!viagemEmAndamento?.id_paciente) return null;
    return getUserName(viagemEmAndamento.id_paciente);
  }, [viagemEmAndamento, getUserName]);

  const handlePressDetalhes = (viagemId) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate("DetalhesViagem", { id: viagemId });
    } else {
      navigation.navigate("DetalhesViagem", { id: viagemId });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTravels();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
          />
        }
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">
            Olá, {user?.nome?.split(" ")[0] || "Motorista"}!
          </Text>
          <Text className="text-base text-gray-500 mt-1">
            Aqui está o seu resumo do dia.
          </Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          <StatsCard
            icon="package"
            title="Atribuídas"
            value={viagensAtribuidas}
            iconColor="#9333EA"
            bgColor="#9333EA"
          />
          <StatsCard
            icon="check-circle"
            title="Concluídas"
            value={viagensConcluidasHoje}
            iconColor="#22C55E"
            bgColor="#22C55E"
          />
        </View>
        <View className="flex-row gap-3">
          <StatsCard
            icon="calendar"
            title="Hoje"
            value={viagensHoje.length}
            iconColor="#F59E0B"
            bgColor="#F59E0B"
          />
          <StatsCard
            icon="navigation"
            title="Ativa"
            value={viagemEmAndamento ? 1 : 0}
            iconColor="#3B82F6"
            bgColor="#3B82F6"
          />
        </View>

        {viagemEmAndamento ? (
          <ViagemEmAndamento
            viagem={viagemEmAndamento}
            pacienteNome={pacienteNomeEmAndamento}
            onPressDetalhes={() => handlePressDetalhes(viagemEmAndamento.id)}
          />
        ) : (
          <EmptyState
            icon="car-off"
            title="Nenhuma viagem ativa"
            description="Você não possui nenhuma viagem em andamento no momento."
          />
        )}

        {viagensHoje.length > 0 ? (
          <ViagensHoje
            viagens={viagensHoje}
            getUserName={getUserName}
            onPressViagem={handlePressDetalhes}
          />
        ) : (
          <EmptyState
            icon="calendar-blank"
            title="Sem viagens agendadas hoje"
            description="Aproveite para descansar. Você será notificado quando houver novas viagens."
          />
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
