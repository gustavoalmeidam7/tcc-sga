import {
  Text,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDriver } from "@/src/hooks/useDriver";
import { useTravels } from "@/src/hooks/useTravels";
import { useAmbulance } from "@/src/hooks/useAmbulance";
import { useState } from "react";
import {
  getAmbulanceStatusLabel,
  getAmbulanceTypeLabel,
  getAmbulanceStatusColor,
  AmbulanceStatus,
} from "@/src/lib/ambulance";
import ConfirmModal from "@/src/components/ConfirmModal";
import { ThemedCard, ThemedText, ThemedView } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

const InfoCard = ({
  icon,
  label,
  value,
  iconColor = "#3B82F6",
  bgColor = "#EFF6FF",
}) => {
  const { isDark, colors } = useThemeStyles();
  return (
    <ThemedCard className="rounded-2xl p-5 mb-3">
      <View className="flex-row items-center mb-3">
        <View
          className="p-3 rounded-xl mr-4"
          style={{ backgroundColor: bgColor }}
        >
          <Feather name={icon} size={24} color={iconColor} />
        </View>
        <View className="flex-1">
          <ThemedText
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wide mb-1"
          >
            {label}
          </ThemedText>
          <ThemedText variant="primary" className="text-lg font-bold">
            {value || "Não informado"}
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
};

const StatusCard = ({ status, emViagem }) => {
  const displayStatus =
    status !== AmbulanceStatus.MAINTENANCE && emViagem
      ? AmbulanceStatus.IN_USE
      : status;

  const statusColor =
    displayStatus !== undefined
      ? getAmbulanceStatusColor(displayStatus)
      : { bg: "#22C55E", text: "white" };

  return (
    <View
      className="rounded-2xl p-6 mb-4"
      style={{ backgroundColor: statusColor.bg }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white text-lg font-bold mb-1">
            {getAmbulanceStatusLabel(displayStatus)}
          </Text>
          <Text className="text-white/90 text-sm">
            {displayStatus === AmbulanceStatus.MAINTENANCE
              ? "A ambulância está em manutenção e não receberá novas viagens"
              : displayStatus === AmbulanceStatus.ACTIVE
                ? "A ambulância está disponível para viagens"
                : displayStatus === AmbulanceStatus.IN_USE
                  ? "A ambulância está em uso em uma viagem"
                  : "Status desconhecido"}
          </Text>
        </View>
        <View className="bg-white/20 p-3 rounded-full">
          <MaterialCommunityIcons
            name={
              displayStatus === AmbulanceStatus.MAINTENANCE
                ? "wrench"
                : displayStatus === AmbulanceStatus.IN_USE
                  ? "navigation"
                  : "check-circle"
            }
            size={28}
            color="white"
          />
        </View>
      </View>
    </View>
  );
};

export default function Ambulancias() {
  const insets = useSafeAreaInsets();
  const { isDark, bg, text, colors } = useThemeStyles();
  const [refreshing, setRefreshing] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const {
    driverInfo,
    loading: driverLoading,
    error: driverError,
    fetchDriverInfo,
  } = useDriver();
  const {
    ambulance,
    loading: ambulanceLoading,
    error: ambulanceError,
    fetchAmbulance,
    updateAmbulanceStatus,
  } = useAmbulance();
  const { getTravelStats } = useTravels();

  const { viagemEmAndamento } = getTravelStats();
  const emViagem = viagemEmAndamento ? true : false;
  const loading = driverLoading || ambulanceLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDriverInfo(), fetchAmbulance()]);
    setRefreshing(false);
  };

  const handleSetMaintenance = () => {
    setShowMaintenanceConfirm(true);
  };

  const confirmMaintenance = async () => {
    try {
      setShowMaintenanceConfirm(false);
      await updateAmbulanceStatus(
        ambulance.id,
        AmbulanceStatus.MAINTENANCE,
        ambulance.tipo
      );
    } catch (err) {
      Alert.alert(
        "Erro",
        err.message || "Erro ao atualizar status da ambulância"
      );
    }
  };

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

      <ScrollView
        className="flex-1"
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
        <ThemedView
          variant="card"
          className="px-5 pt-4 pb-6 border-b shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <ThemedText variant="primary" className="text-2xl font-bold">
                Minha Ambulância
              </ThemedText>
              <ThemedText variant="muted" className="text-base mt-1">
                Informações do veículo atribuído
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
                      ? "#64748B"
                      : "#9CA3AF"
                    : isDark
                      ? colors.primary
                      : "#3B82F6"
                }
              />
            </TouchableOpacity>
          </View>
        </ThemedView>

        <View className="px-5 pb-6">
          {(driverError || ambulanceError) && (
            <View className="mx-5 mb-4 bg-red-100 p-4 rounded-xl">
              <Text className="text-red-600 font-semibold">
                {driverError || ambulanceError}
              </Text>
            </View>
          )}

          {loading && !refreshing ? (
            <View className="items-center py-12">
              <ActivityIndicator
                size="large"
                color={isDark ? "#60A5FA" : "#3B82F6"}
              />
              <ThemedText variant="muted" className="mt-4">
                Carregando informações...
              </ThemedText>
            </View>
          ) : ambulance ? (
            <>
              <StatusCard status={ambulance.status} emViagem={emViagem} />

              <View className="mb-4">
                <ThemedText
                  variant="primary"
                  className="text-xl font-bold mb-3"
                >
                  Informações do Veículo
                </ThemedText>

                <InfoCard
                  icon="shield"
                  label="Tipo"
                  value={getAmbulanceTypeLabel(ambulance.tipo)}
                  iconColor="#9333EA"
                  bgColor="#FAF5FF"
                />

                <InfoCard
                  icon="hash"
                  label="Placa"
                  value={ambulance.placa?.toUpperCase() || "Não informada"}
                  iconColor="#F59E0B"
                  bgColor="#FFF7ED"
                />

                <ThemedCard className="rounded-2xl p-5 mb-3">
                  <View className="flex-row items-center">
                    <View
                      className="p-3 rounded-xl mr-4"
                      style={{
                        backgroundColor:
                          getAmbulanceStatusColor(
                            ambulance.status !== AmbulanceStatus.MAINTENANCE &&
                              emViagem
                              ? AmbulanceStatus.IN_USE
                              : ambulance.status
                          ).bg + "20",
                      }}
                    >
                      <MaterialCommunityIcons
                        name={
                          ambulance.status === AmbulanceStatus.MAINTENANCE
                            ? "wrench"
                            : ambulance.status === AmbulanceStatus.IN_USE ||
                                emViagem
                              ? "navigation"
                              : "check-circle"
                        }
                        size={24}
                        color={
                          getAmbulanceStatusColor(
                            ambulance.status !== AmbulanceStatus.MAINTENANCE &&
                              emViagem
                              ? AmbulanceStatus.IN_USE
                              : ambulance.status
                          ).bg
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <ThemedText
                        variant="muted"
                        className="text-xs font-semibold uppercase tracking-wide mb-1"
                      >
                        Status Atual
                      </ThemedText>
                      <View className="flex-row items-center">
                        <View
                          className="px-3 py-1.5 rounded-full mr-2"
                          style={{
                            backgroundColor: getAmbulanceStatusColor(
                              ambulance.status !==
                                AmbulanceStatus.MAINTENANCE && emViagem
                                ? AmbulanceStatus.IN_USE
                                : ambulance.status
                            ).bg,
                          }}
                        >
                          <Text
                            className="text-xs font-bold"
                            style={{
                              color: getAmbulanceStatusColor(
                                ambulance.status !==
                                  AmbulanceStatus.MAINTENANCE && emViagem
                                  ? AmbulanceStatus.IN_USE
                                  : ambulance.status
                              ).text,
                            }}
                          >
                            {getAmbulanceStatusLabel(
                              ambulance.status !==
                                AmbulanceStatus.MAINTENANCE && emViagem
                                ? AmbulanceStatus.IN_USE
                                : ambulance.status
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ThemedCard>
              </View>

              <View className="mb-4">
                <ThemedText
                  variant="primary"
                  className="text-xl font-bold mb-3"
                >
                  Ações
                </ThemedText>
                {ambulance.status === AmbulanceStatus.MAINTENANCE ? (
                  <View className="bg-orange-100 rounded-xl py-4 px-4 flex-row items-center shadow-sm border border-orange-200">
                    <Feather
                      name="tool"
                      size={24}
                      color="#EA580C"
                      style={{ marginRight: 12 }}
                    />
                    <View className="flex-1">
                      <Text className="text-orange-800 font-bold text-base">
                        Ambulância em Manutenção
                      </Text>
                      <Text className="text-orange-700 text-xs mt-1">
                        Apenas o gerente pode liberar a ambulância novamente.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      if (emViagem) {
                        Alert.alert(
                          "Ação Bloqueada",
                          "Não é possível colocar em manutenção durante uma viagem."
                        );
                        return;
                      }
                      handleSetMaintenance();
                    }}
                    className={`bg-orange-500 rounded-xl py-4 items-center justify-center shadow-md mb-3 ${emViagem ? "opacity-50" : ""}`}
                    activeOpacity={emViagem ? 1 : 0.7}
                    disabled={emViagem}
                  >
                    <View className="flex-row items-center">
                      <Feather
                        name="tool"
                        size={20}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-white font-bold text-base">
                        Marcar como Em Manutenção
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View className="mb-4">
                <ThemedText
                  variant="primary"
                  className="text-xl font-bold mb-3"
                >
                  Equipamentos a Bordo
                </ThemedText>
                {ambulance.equipamentos && ambulance.equipamentos.length > 0 ? (
                  <ThemedCard className="rounded-2xl p-5">
                    {ambulance.equipamentos.map((equipamento, index) => (
                      <View
                        key={index}
                        className={`pb-4 ${index < ambulance.equipamentos.length - 1 ? `border-b ${isDark ? "border-dark-border" : "border-gray-200"} mb-4` : ""}`}
                      >
                        <View className="flex-row items-start">
                          <View className="bg-blue-100 p-2 rounded-lg mr-3">
                            <MaterialCommunityIcons
                              name="package-variant"
                              size={20}
                              color="#3B82F6"
                            />
                          </View>
                          <View className="flex-1">
                            <ThemedText
                              variant="primary"
                              className="text-base font-bold mb-1"
                            >
                              {equipamento.equipamento ||
                                equipamento.nome ||
                                "Equipamento"}
                            </ThemedText>
                            {equipamento.descricao && (
                              <ThemedText
                                variant="secondary"
                                className="text-sm"
                              >
                                {equipamento.descricao}
                              </ThemedText>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </ThemedCard>
                ) : (
                  <ThemedCard className="rounded-2xl p-8 items-center">
                    <View className={`${bg.muted} p-4 rounded-full mb-3`}>
                      <MaterialCommunityIcons
                        name="package-variant-closed"
                        size={32}
                        color={isDark ? "#64748B" : "#9CA3AF"}
                      />
                    </View>
                    <ThemedText
                      variant="primary"
                      className="text-base font-semibold mb-1"
                    >
                      Nenhum equipamento
                    </ThemedText>
                    <ThemedText variant="muted" className="text-sm text-center">
                      Esta ambulância ainda não possui equipamentos cadastrados
                    </ThemedText>
                  </ThemedCard>
                )}
              </View>

              {driverInfo && (
                <View>
                  <ThemedText
                    variant="primary"
                    className="text-xl font-bold mb-3"
                  >
                    Minhas Credenciais
                  </ThemedText>
                  <InfoCard
                    icon="credit-card"
                    label="CNH"
                    value={driverInfo.cnh || "Não informada"}
                    iconColor="#9333EA"
                    bgColor="#FAF5FF"
                  />
                  <InfoCard
                    icon="calendar"
                    label="Vencimento CNH"
                    value={
                      driverInfo.vencimento
                        ? new Date(driverInfo.vencimento).toLocaleDateString(
                            "pt-BR"
                          )
                        : "Não informado"
                    }
                    iconColor="#F59E0B"
                    bgColor="#FFF7ED"
                  />
                </View>
              )}
            </>
          ) : (
            <View className="items-center py-12">
              <View className={`${bg.muted} p-6 rounded-full mb-4`}>
                <MaterialCommunityIcons
                  name="ambulance"
                  size={64}
                  color={isDark ? "#64748B" : "#9CA3AF"}
                />
              </View>
              <ThemedText
                variant="primary"
                className="text-xl font-bold text-center mb-2"
              >
                Sem Ambulância Atribuída
              </ThemedText>
              <ThemedText
                variant="muted"
                className="text-base text-center px-8"
              >
                Aguarde a atribuição de uma ambulância pelo gerente.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showMaintenanceConfirm}
        title="Marcar em Manutenção"
        message="Tem certeza que deseja marcar esta ambulância como em manutenção? Ela não receberá novas viagens."
        onConfirm={confirmMaintenance}
        onCancel={() => setShowMaintenanceConfirm(false)}
        confirmText="Confirmar"
        type="danger"
      />
    </ThemedView>
  );
}
