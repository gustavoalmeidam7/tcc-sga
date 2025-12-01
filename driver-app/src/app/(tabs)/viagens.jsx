import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTravels } from "@/src/hooks/useTravels";
import { useUsers } from "@/src/hooks/useUsers";
import { formatarHora } from "@/src/lib/date-utils";
import { formatarEndereco } from "@/src/lib/format-utils";
import { TravelStatus, getTravelStatusLabel } from "@/src/lib/travel-status";
import { useMemo, useState, useCallback } from "react";
import { ThemedCard, ThemedText, ThemedView } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

const getStatusStyles = (status) => {
  switch (status) {
    case TravelStatus.REALIZADO:
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      };
    case TravelStatus.EM_PROGRESSO:
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    default:
      return {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
      };
  }
};

const ViagemCard = ({ viagem, pacienteNome, onPress }) => {
  const { isDark, colors } = useThemeStyles();
  const statusLabel = getTravelStatusLabel(viagem.realizado);
  const styles = getStatusStyles(viagem.realizado);
  const dataFormatada = new Date(viagem.inicio).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
  const horaFormatada = formatarHora(viagem.inicio);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className="mb-4">
      <ThemedCard className="rounded-2xl overflow-hidden">
        <ThemedView
          variant="muted"
          className="flex-row items-center justify-between p-4 border-b"
        >
          <View className="flex-row items-center gap-2">
            <ThemedView variant="card" className="p-2 rounded-lg border">
              <Feather
                name="calendar"
                size={16}
                color={isDark ? colors.foregroundMuted : "#6B7280"}
              />
            </ThemedView>
            <View>
              <ThemedText variant="primary" className="text-sm font-bold">
                {dataFormatada}
              </ThemedText>
              <ThemedText variant="muted" className="text-xs">
                {horaFormatada}
              </ThemedText>
            </View>
          </View>
          <View
            className={`${styles.bg} px-3 py-1.5 rounded-full border ${styles.border}`}
          >
            <Text className={`${styles.text} text-xs font-bold`}>
              {statusLabel}
            </Text>
          </View>
        </ThemedView>

        <View className="p-4">
          <ThemedText variant="primary" className="text-lg font-bold mb-4">
            {pacienteNome || "Paciente não informado"}
          </ThemedText>

          <View className="relative pl-4">
            <View
              className="absolute left-[7px] top-2 bottom-6 w-[2px]"
              style={{ backgroundColor: isDark ? colors.border : "#E5E7EB" }}
            />
            <View className="mb-5 flex-row items-start">
              <View
                className="absolute -left-4 mt-1 w-3.5 h-3.5 rounded-full border-2 z-10"
                style={{
                  borderColor: isDark ? colors.primary : "#3B82F6",
                  backgroundColor: isDark ? colors.card : "#FFFFFF",
                }}
              />
              <View className="flex-1 ml-2">
                <ThemedText
                  variant="muted"
                  className="text-xs font-bold uppercase mb-0.5"
                >
                  Origem
                </ThemedText>
                <ThemedText
                  variant="secondary"
                  className="text-sm font-medium leading-5"
                  numberOfLines={2}
                >
                  {formatarEndereco(viagem.end_inicio)}
                </ThemedText>
              </View>
            </View>

            <View className="flex-row items-start">
              <View
                className="absolute -left-4 mt-1 w-3.5 h-3.5 rounded-full border-2 shadow-sm z-10"
                style={{
                  backgroundColor: colors.success,
                  borderColor: isDark ? colors.card : "#FFFFFF",
                }}
              />
              <View className="flex-1 ml-2">
                <ThemedText
                  variant="muted"
                  className="text-xs font-bold uppercase mb-0.5"
                >
                  Destino
                </ThemedText>
                <ThemedText
                  variant="secondary"
                  className="text-sm font-medium leading-5"
                  numberOfLines={2}
                >
                  {formatarEndereco(viagem.end_fim)}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-4 flex-row justify-end">
          <View className="flex-row items-center">
            <ThemedText
              variant="primary"
              className="text-xs font-bold mr-1"
              style={{ color: isDark ? colors.primary : "#2563EB" }}
            >
              Ver detalhes
            </ThemedText>
            <Feather
              name="arrow-right"
              size={14}
              color={isDark ? colors.primary : "#2563EB"}
            />
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};

export default function Viagens() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, colors } = useThemeStyles();

  const [refreshing, setRefreshing] = useState(false);
  const { travels, loading, error, fetchTravels } = useTravels();

  const pacienteIds = useMemo(() => {
    return travels.map((t) => t.id_paciente).filter(Boolean);
  }, [travels]);

  const { getUserName } = useUsers(pacienteIds);

  const handlePressViagem = useCallback(
    (id) => {
      navigation.navigate("Detalhes", { id });
    },
    [navigation]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTravels();
    setRefreshing(false);
  };

  const renderViagem = useCallback(
    ({ item: viagem }) => {
      const pacienteNome = viagem.id_paciente
        ? getUserName(viagem.id_paciente)
        : null;

      return (
        <ViagemCard
          viagem={viagem}
          pacienteNome={pacienteNome}
          onPress={() => handlePressViagem(viagem.id)}
        />
      );
    },
    [getUserName, handlePressViagem]
  );

  if (loading && !refreshing) {
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
            Carregando viagens...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error && !refreshing) {
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
          <ThemedText variant="primary" className="text-xl font-bold mb-4">
            Minhas Viagens
          </ThemedText>
          <ThemedText variant="muted" className="text-xs mb-4">
            Viagens atribuídas a você
          </ThemedText>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Feather name="alert-circle" size={48} color={colors.error} />
          <ThemedText
            variant="primary"
            className="text-xl font-bold mt-4 text-center"
          >
            Erro ao carregar viagens
          </ThemedText>
          <ThemedText variant="muted" className="mt-2 text-center">
            {error}
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

      <ThemedView variant="card" className="px-5 pt-4 pb-4 border-b">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <ThemedText variant="primary" className="text-2xl font-bold">
              Viagens
            </ThemedText>
            <ThemedText variant="muted" className="text-sm mt-1">
              {travels.length} viagem{travels.length !== 1 ? "ens" : ""}{" "}
              encontrada{travels.length !== 1 ? "s" : ""}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            disabled={refreshing}
            className="p-2"
          >
            <Feather
              name="refresh-ccw"
              size={20}
              color={
                refreshing
                  ? isDark
                    ? colors.foregroundMuted
                    : "#9CA3AF"
                  : isDark
                    ? colors.primary
                    : "#3B82F6"
              }
            />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <FlatList
        data={travels}
        keyExtractor={(item) => item.id}
        renderItem={renderViagem}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor={isDark ? colors.primary : "#3B82F6"}
          />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <View
              className="p-6 rounded-full mb-4"
              style={{ backgroundColor: isDark ? colors.input : "#F3F4F6" }}
            >
              <Feather
                name="map"
                size={48}
                color={isDark ? colors.foregroundMuted : "#9CA3AF"}
              />
            </View>
            <ThemedText
              variant="primary"
              className="text-xl font-bold text-center mb-2"
            >
              Nenhuma viagem encontrada
            </ThemedText>
            <ThemedText variant="muted" className="text-base text-center px-8">
              Você ainda não possui nenhuma viagem atribuída.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}
