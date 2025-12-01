import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/src/contexts/AuthContext";
import { useDriver } from "@/src/hooks/useDriver";
import { useAmbulance } from "@/src/hooks/useAmbulance";
import { formatarData } from "@/src/lib/date-utils";
import { formatCPF, formatPhone } from "@/src/lib/format-utils";
import authService from "@/src/services/auth";
import ConfirmModal from "@/src/components/ConfirmModal";
import { ThemedCard, ThemedText, ThemedView } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

const InfoCard = ({
  icon,
  label,
  value,
  editable,
  editMode,
  field,
  type,
  formData,
  setFormData,
}) => {
  const { isDark, colors } = useThemeStyles();
  return (
    <ThemedCard className="rounded-xl p-4 mb-3">
      <View className="flex-row items-center mb-2">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
          style={{
            backgroundColor: isDark
              ? `${colors.primary}20`
              : `${colors.primary}10`,
          }}
        >
          <Feather
            name={icon}
            size={16}
            color={isDark ? colors.primary : "#3B82F6"}
          />
        </View>
        <ThemedText variant="muted" className="text-xs font-semibold uppercase">
          {label}
        </ThemedText>
      </View>
      {editMode && field && editable ? (
        <TextInput
          value={formData[field] || ""}
          onChangeText={(text) => {
            if (type === "date" && text) {
              const numbers = text.replace(/\D/g, "");
              let formatted = numbers;
              if (numbers.length > 2) {
                formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
              }
              if (numbers.length > 4) {
                formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
              }
              setFormData({ ...formData, [field]: formatted });
            } else {
              setFormData({ ...formData, [field]: text });
            }
          }}
          keyboardType={
            type === "email"
              ? "email-address"
              : type === "tel"
                ? "phone-pad"
                : type === "date"
                  ? "numeric"
                  : "default"
          }
          placeholder={type === "date" ? "DD/MM/AAAA" : undefined}
          maxLength={type === "date" ? 10 : undefined}
          className="text-base font-medium px-3 py-2 rounded-lg"
          style={{
            color: isDark ? colors.foreground : "#1E293B",
            backgroundColor: isDark ? colors.input : "#F1F5F9",
          }}
          placeholderTextColor={isDark ? colors.foregroundMuted : "#9CA3AF"}
        />
      ) : (
        <ThemedText variant="primary" className="text-base font-medium ml-11">
          {value || "Não informado"}
        </ThemedText>
      )}
    </ThemedCard>
  );
};

const StatBadge = ({ label, value, icon, color = "bg-light-primary" }) => {
  const { colors } = useThemeStyles();
  const bgColor =
    color === "bg-light-success"
      ? colors.success || "#22C55E"
      : colors.primary || "#3B82F6";

  return (
    <View
      className="rounded-xl p-3 flex-1 items-center"
      style={{ backgroundColor: bgColor }}
    >
      <Feather name={icon} size={20} color="white" />
      <Text className="text-white text-xl font-bold mt-1">{value}</Text>
      <Text className="text-white/80 text-xs font-medium mt-0.5">{label}</Text>
    </View>
  );
};

export default function Perfil() {
  const { user, refreshUser, logout } = useAuth();
  const {
    driverInfo,
    loading: isLoadingDriver,
    fetchDriverInfo,
    updateDriver,
  } = useDriver();
  const { ambulance, fetchAmbulance } = useAmbulance();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, bg, text, colors } = useThemeStyles();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    cnh: driverInfo?.cnh || "",
    vencimento: driverInfo?.vencimento || "",
  });

  useEffect(() => {
    if (user) {
      const vencimentoFormatado = driverInfo?.vencimento
        ? new Date(driverInfo.vencimento).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";

      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        cnh: driverInfo?.cnh || "",
        vencimento: vencimentoFormatado,
      });
    }
  }, [user, driverInfo]);

  const handleSalvar = async () => {
    try {
      setLoading(true);

      const userUpdateData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: user?.cargo || 1,
      };

      await authService.updateUser(userUpdateData);
      await refreshUser();

      if (driverInfo) {
        const driverUpdateData = {};

        if (formData.cnh && formData.cnh !== driverInfo.cnh) {
          driverUpdateData.cnh = formData.cnh;
        }

        if (formData.vencimento) {
          const currentVencimentoBr = driverInfo?.vencimento
            ? new Date(driverInfo.vencimento).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "";

          if (
            formData.vencimento !== currentVencimentoBr &&
            formData.vencimento.length === 10
          ) {
            try {
              let dateToSend;
              if (formData.vencimento.includes("/")) {
                const [day, month, year] = formData.vencimento.split("/");
                if (!day || !month || !year || year.length !== 4) {
                  throw new Error("Data incompleta. Use o formato DD/MM/AAAA");
                }
                dateToSend = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
              } else {
                dateToSend = formData.vencimento;
              }

              const dateObj = new Date(dateToSend);
              if (isNaN(dateObj.getTime())) {
                throw new Error("Data inválida. Use o formato DD/MM/AAAA");
              }

              if (dateObj <= new Date()) {
                throw new Error("A data de vencimento deve ser futura");
              }

              driverUpdateData.vencimento = dateToSend;
            } catch (dateError) {
              Alert.alert(
                "Erro",
                dateError.message || "Formato de data inválido. Use DD/MM/AAAA"
              );
              setLoading(false);
              return;
            }
          }
        }

        if (Object.keys(driverUpdateData).length > 0) {
          await updateDriver(driverUpdateData);
          await fetchDriverInfo();
        }
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Não foi possível atualizar o perfil";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    const vencimentoFormatado = driverInfo?.vencimento
      ? new Date(driverInfo.vencimento).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
      telefone: user?.telefone || "",
      cnh: driverInfo?.cnh || "",
      vencimento: vencimentoFormatado,
    });
    setEditMode(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshUser(), fetchDriverInfo(), fetchAmbulance()]);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await authService.deleteUser();

      Alert.alert("Conta Deletada", "Sua conta foi removida permanentemente.", [
        {
          text: "OK",
          onPress: async () => {
            await logout();
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Não foi possível deletar a conta. Tente novamente.";
      Alert.alert("Erro", errorMessage);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <ThemedView
        variant="secondary"
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator
          size="large"
          color={isDark ? colors.primary : "#3B82F6"}
        />
        <ThemedText variant="muted" className="mt-4">
          Carregando perfil...
        </ThemedText>
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

      {loading && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <ThemedCard className="p-6 rounded-2xl items-center">
            <ActivityIndicator
              size="large"
              color={isDark ? colors.primary : "#3B82F6"}
            />
            <ThemedText variant="primary" className="mt-3 font-semibold">
              Salvando alterações...
            </ThemedText>
          </ThemedCard>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor={isDark ? colors.primary : "#3B82F6"}
          />
        }
      >
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                className="mr-3 w-10 h-10 items-center justify-center"
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather
                  name="arrow-left"
                  size={24}
                  color={isDark ? colors.foreground : "#1F2937"}
                />
              </TouchableOpacity>
              <View className="flex-1">
                <ThemedText variant="primary" className="text-2xl font-bold">
                  Perfil
                </ThemedText>
                <ThemedText variant="muted" className="text-sm mt-1">
                  Gerencie suas informações
                </ThemedText>
              </View>
            </View>
            <View className="flex-row gap-2 items-center">
              {!editMode && (
                <TouchableOpacity
                  className="h-10 w-10 items-center justify-center"
                  onPress={onRefresh}
                  disabled={refreshing}
                  activeOpacity={0.7}
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
              )}
              {!editMode ? (
                <TouchableOpacity
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isDark ? colors.primary : "#3B82F6",
                  }}
                  onPress={() => setEditMode(true)}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={18} color="white" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="h-10 px-4 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isDark ? colors.input : "#F1F5F9",
                    }}
                    onPress={handleCancelar}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name="x"
                      size={18}
                      color={isDark ? colors.foregroundMuted : "#6B7280"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="h-10 px-4 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isDark ? colors.primary : "#3B82F6",
                    }}
                    onPress={handleSalvar}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Feather name="check" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="px-5 mb-4">
          <ThemedCard className="rounded-2xl p-5">
            <View className="flex-row items-center">
              <View
                className="h-16 w-16 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: isDark ? colors.primary : "#3B82F6" }}
              >
                <Text className="text-2xl font-bold text-white">
                  {getInitials(user?.nome)}
                </Text>
              </View>
              <View className="flex-1">
                <ThemedText variant="primary" className="text-xl font-bold">
                  {user?.nome || "Usuário"}
                </ThemedText>
                <ThemedText variant="muted" className="text-sm mt-0.5">
                  {user?.email || ""}
                </ThemedText>
              </View>
              {driverInfo?.em_viagem ? (
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: isDark
                      ? `${colors.error}20`
                      : `${colors.error}10`,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.error }}
                  >
                    Em viagem
                  </Text>
                </View>
              ) : (
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: isDark
                      ? `${colors.success}20`
                      : `${colors.success}10`,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.success }}
                  >
                    Disponível
                  </Text>
                </View>
              )}
            </View>
          </ThemedCard>
        </View>

        {driverInfo && (
          <View className="px-5 mb-4">
            <View className="flex-row gap-3">
              {driverInfo?.cnh && (
                <StatBadge
                  icon="credit-card"
                  label="CNH"
                  value={driverInfo.cnh}
                  color="bg-light-success"
                />
              )}
              {ambulance?.placa && (
                <StatBadge
                  icon="truck"
                  label="Placa"
                  value={ambulance.placa.toUpperCase()}
                  color="bg-light-primary"
                />
              )}
            </View>
          </View>
        )}

        <View className="px-5 mb-4">
          <ThemedText variant="primary" className="text-base font-bold mb-3">
            Dados Pessoais
          </ThemedText>
          <InfoCard
            icon="user"
            label="Nome Completo"
            value={user?.nome}
            field="nome"
            editable={true}
            editMode={editMode}
            formData={formData}
            setFormData={setFormData}
          />
          <InfoCard
            icon="mail"
            label="E-mail"
            value={user?.email}
            field="email"
            type="email"
            editable={true}
            editMode={editMode}
            formData={formData}
            setFormData={setFormData}
          />
          <InfoCard
            icon="phone"
            label="Telefone"
            value={formatPhone(user?.telefone || "")}
            field="telefone"
            type="tel"
            editable={true}
            editMode={editMode}
            formData={formData}
            setFormData={setFormData}
          />
          <InfoCard
            icon="credit-card"
            label="CPF"
            value={formatCPF(user?.cpf || "")}
            editable={false}
            editMode={false}
          />
          <InfoCard
            icon="calendar"
            label="Data de Nascimento"
            value={formatarData(user?.nascimento)}
            editable={false}
            editMode={false}
          />
        </View>

        <View className="px-5 mb-4">
          <ThemedText variant="primary" className="text-base font-bold mb-3">
            Dados Profissionais
          </ThemedText>
          {isLoadingDriver ? (
            <ThemedCard className="rounded-xl p-4 items-center">
              <ActivityIndicator
                size="small"
                color={isDark ? colors.primary : "#3B82F6"}
              />
              <ThemedText variant="muted" className="text-sm mt-2">
                Carregando...
              </ThemedText>
            </ThemedCard>
          ) : (
            <>
              <InfoCard
                icon="credit-card"
                label="CNH"
                value={driverInfo?.cnh || ""}
                field="cnh"
                editable={true}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
              <InfoCard
                icon="calendar"
                label="Vencimento CNH"
                value={
                  driverInfo?.vencimento
                    ? new Date(driverInfo.vencimento).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : ""
                }
                field="vencimento"
                type="date"
                editable={true}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
              <InfoCard
                icon="truck"
                label="Ambulância Atribuída"
                value={
                  ambulance?.placa
                    ? ambulance.placa.toUpperCase()
                    : driverInfo?.id_ambulancia
                      ? "Aguardando carregamento..."
                      : "Aguardando atribuição"
                }
                editable={false}
              />
            </>
          )}
        </View>

        <View className="px-5 mb-6">
          <ThemedText variant="primary" className="text-base font-bold mb-3">
            Ações
          </ThemedText>
          <ThemedCard
            className="rounded-xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: isDark ? `${colors.error}30` : `${colors.error}30`,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() => setShowDeleteConfirm(true)}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                style={{
                  backgroundColor: isDark
                    ? `${colors.error}20`
                    : `${colors.error}10`,
                }}
              >
                <Feather name="trash-2" size={18} color={colors.error} />
              </View>
              <View className="flex-1">
                <ThemedText
                  variant="primary"
                  className="text-base font-semibold"
                >
                  Deletar Conta
                </ThemedText>
                <ThemedText variant="muted" className="text-xs mt-0.5">
                  Remove permanentemente todos os dados
                </ThemedText>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={isDark ? colors.foregroundMuted : "#9CA3AF"}
              />
            </TouchableOpacity>
          </ThemedCard>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Deletar Conta?"
        message="Esta ação é irreversível. Todos os seus dados serão removidos permanentemente."
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Deletar"
        type="danger"
      />
    </ThemedView>
  );
}
