import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/src/contexts/AuthContext";
import { useActiveTravel } from "@/src/contexts/ActiveTravelContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState, useEffect } from "react";
import { useTravels } from "@/src/hooks/useTravels";
import { useUsers } from "@/src/hooks/useUsers";
import { formatarHora } from "@/src/lib/date-utils";
import { formatarEndereco } from "@/src/lib/format-utils";
import { TravelStatus } from "@/src/lib/travel-status";
import travelService from "@/src/services/travel";
import ConfirmModal from "@/src/components/ConfirmModal";
import { ThemedCard, ThemedText } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

const StatsCard = ({ icon, title, value, iconColor, bgColor }) => {
  return (
    <ThemedCard className="rounded-xl p-4 flex-1 items-center justify-center">
      <View
        className="p-2 rounded-full"
        style={{ backgroundColor: bgColor + "20" }}
      >
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <ThemedText variant="primary" className="text-2xl font-bold mt-2">
        {value}
      </ThemedText>
      <ThemedText
        variant="muted"
        className="text-xs font-semibold uppercase tracking-wide mt-0.5"
      >
        {title}
      </ThemedText>
    </ThemedCard>
  );
};

const ViagemEmAndamento = ({
  viagem,
  pacienteNome,
  onPressDetalhes,
  onFinalizarViagem,
  onIrParaNavegacao,
}) => (
  <TouchableOpacity
    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-xl mt-6"
    style={{ backgroundColor: "#2563EB" }}
    activeOpacity={0.9}
    onPress={onPressDetalhes}
  >
    <View className="flex-row items-center mb-3">
      <View className="bg-white/20 p-2 rounded-full">
        <Feather name="navigation" size={20} color="white" />
      </View>
      <Text className="text-white text-lg font-bold ml-3">
        Viagem em Andamento
      </Text>
    </View>
    <Text className="text-white text-xl font-semibold mb-4" numberOfLines={1}>
      {pacienteNome ? `Paciente ${pacienteNome}` : "Paciente não informado"}
    </Text>
    <View className="mb-6 space-y-2 gap-1">
      <View className="flex-row items-start">
        <Feather
          name="map-pin"
          size={16}
          color="#DBEAFE"
          style={{ marginTop: 3, marginRight: 8 }}
        />
        <Text
          className="text-blue-100 text-sm flex-1 font-medium"
          numberOfLines={2}
        >
          {formatarEndereco(viagem.end_inicio)}
        </Text>
      </View>
      <View className="flex-row items-start">
        <Feather
          name="flag"
          size={16}
          color="#DBEAFE"
          style={{ marginTop: 3, marginRight: 8 }}
        />
        <Text
          className="text-blue-100 text-sm flex-1 font-medium"
          numberOfLines={2}
        >
          {formatarEndereco(viagem.end_fim)}
        </Text>
      </View>
    </View>

    {(onIrParaNavegacao || onFinalizarViagem) && (
      <View className="flex-row gap-3">
        {onIrParaNavegacao && (
          <TouchableOpacity
            className="flex-1 bg-yellow-500 rounded-xl py-3.5 items-center justify-center shadow-sm"
            activeOpacity={0.7}
            onPress={onIrParaNavegacao}
          >
            <View className="flex-row items-center">
              <Feather
                name="map"
                size={18}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white font-bold text-base">Navegar</Text>
            </View>
          </TouchableOpacity>
        )}
        {onFinalizarViagem && (
          <TouchableOpacity
            className="flex-1 bg-green-500 rounded-xl py-3.5 items-center justify-center shadow-sm"
            activeOpacity={0.7}
            onPress={onFinalizarViagem}
          >
            <Text className="text-white font-bold text-base">Finalizar</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
  </TouchableOpacity>
);

const ViagensHoje = ({
  viagens,
  getUserName,
  onPressViagem,
  onIrParaNavegacao,
}) => {
  const { isDark } = useThemeStyles();
  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <ThemedText variant="primary" className="text-xl font-bold">
          Agendadas para Hoje
        </ThemedText>
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
        const podeNavegar =
          viagem.realizado === TravelStatus.EM_PROGRESSO ||
          viagem.realizado === TravelStatus.NAO_REALIZADO;

        return (
          <ThemedCard key={viagem.id} className="rounded-2xl p-5 mb-3">
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => onPressViagem(viagem.id)}
            >
              <View className="bg-blue-50 rounded-xl px-4 py-3 mr-4 items-center justify-center">
                <Text className="text-sm font-semibold text-blue-600">
                  {hora}
                </Text>
                <Text className="text-xs font-bold text-blue-400">
                  {minuto}
                </Text>
              </View>
              <View className="flex-1">
                <ThemedText
                  variant="primary"
                  className="text-base font-bold mb-1"
                >
                  {getUserName(viagem.id_paciente)
                    ? `Paciente ${getUserName(viagem.id_paciente)}`
                    : "Paciente não informado"}
                </ThemedText>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
                  <ThemedText variant="muted" className="text-sm">
                    {statusText}
                  </ThemedText>
                </View>
              </View>
              <Feather
                name="chevron-right"
                size={22}
                color={isDark ? "#64748B" : "#D1D5DB"}
              />
            </TouchableOpacity>
            {podeNavegar && onIrParaNavegacao && (
              <TouchableOpacity
                className="mt-3 bg-blue-600 rounded-xl py-2.5 flex-row items-center justify-center"
                activeOpacity={0.7}
                onPress={() => onIrParaNavegacao(viagem.id)}
              >
                <Feather
                  name="map"
                  size={16}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-white font-bold text-sm">
                  Ir para Navegação
                </Text>
              </TouchableOpacity>
            )}
          </ThemedCard>
        );
      })}
    </View>
  );
};

const EmptyState = ({ icon, title, description }) => {
  const { isDark, bg } = useThemeStyles();
  return (
    <ThemedCard className="rounded-3xl p-8 items-center mt-6">
      <View className={`${bg.muted} p-5 rounded-full mb-4`}>
        <MaterialCommunityIcons
          name={icon}
          size={48}
          color={isDark ? "#64748B" : "#9CA3AF"}
        />
      </View>
      <ThemedText
        variant="primary"
        className="text-lg font-bold text-center mb-2"
      >
        {title}
      </ThemedText>
      <ThemedText variant="muted" className="text-sm text-center leading-5">
        {description}
      </ThemedText>
    </ThemedCard>
  );
};

export default function Home() {
  const { user } = useAuth();
  const { setActiveTravel } = useActiveTravel();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, bg } = useThemeStyles();
  const [refreshing, setRefreshing] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchTravels, getTravelStats } = useTravels();
  const {
    viagensAtribuidas,
    viagensConcluidasHoje,
    viagemEmAndamento,
    viagensHoje,
  } = getTravelStats();

  useEffect(() => {
    if (viagemEmAndamento) {
      setActiveTravel(viagemEmAndamento.id);
    } else {
      setActiveTravel(null);
    }
  }, [viagemEmAndamento, setActiveTravel]);

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
    navigation.navigate("Detalhes", { id: viagemId });
  };

  const handleIrParaNavegacao = (viagemId) => {
    navigation.navigate("Navegacao", { id: viagemId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTravels();
    setRefreshing(false);
  };

  const handleFinalizarViagem = () => {
    if (!viagemEmAndamento) return;
    setShowEndConfirm(true);
  };

  const confirmEndTravel = async () => {
    setShowEndConfirm(false);
    try {
      setRefreshing(true);
      await travelService.endTravel(viagemEmAndamento.id);
      await fetchTravels();
    } catch (err) {
      console.error("Erro ao finalizar viagem:", err);
      setErrorMessage(
        err?.message || "Não foi possível finalizar a viagem. Tente novamente."
      );
      setShowErrorModal(true);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View
      className={`flex-1 ${bg.secondary}`}
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
      />
      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor={isDark ? "#60A5FA" : "#3B82F6"}
          />
        }
      >
        <View className="mb-6">
          <ThemedText variant="primary" className="text-3xl font-bold">
            Olá, {user?.nome?.split(" ")[0] || "Motorista"}!
          </ThemedText>
          <ThemedText variant="muted" className="text-base mt-1">
            Aqui está o seu resumo do dia.
          </ThemedText>
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
            onFinalizarViagem={handleFinalizarViagem}
            onIrParaNavegacao={() =>
              handleIrParaNavegacao(viagemEmAndamento.id)
            }
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
            onIrParaNavegacao={handleIrParaNavegacao}
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

      <ConfirmModal
        visible={showEndConfirm}
        title="Finalizar Viagem"
        message="Deseja confirmar a finalização desta viagem?"
        onConfirm={confirmEndTravel}
        onCancel={() => setShowEndConfirm(false)}
        confirmText="Finalizar"
        type="success"
      />

      <ConfirmModal
        visible={showErrorModal}
        title="Erro"
        message={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
        confirmText="OK"
        cancelText=""
        type="danger"
      />
    </View>
  );
}
