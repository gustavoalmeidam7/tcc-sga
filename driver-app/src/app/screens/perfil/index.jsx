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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/src/hooks/useAuth";
import { useDriver } from "@/src/hooks/useDriver";
import { formatarData } from "@/src/lib/date-utils";
import { formatCPF, formatPhone } from "@/src/lib/format-utils";

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
}) => (
  <View className="bg-light-card rounded-xl p-4 mb-3 border border-light-border">
    <View className="flex-row items-center mb-2">
      <View className="w-8 h-8 rounded-lg bg-light-primary/10 items-center justify-center mr-3">
        <Feather name={icon} size={16} color="#3B82F6" />
      </View>
      <Text className="text-xs font-semibold text-light-foreground-muted uppercase">
        {label}
      </Text>
    </View>
    {editMode && field && editable ? (
      <TextInput
        value={formData[field] || ""}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        keyboardType={
          type === "email"
            ? "email-address"
            : type === "tel"
              ? "phone-pad"
              : "default"
        }
        className="text-base font-medium text-light-foreground bg-light-background-secondary px-3 py-2 rounded-lg"
        placeholderTextColor="#9CA3AF"
      />
    ) : (
      <Text className="text-base font-medium text-light-foreground ml-11">
        {value || "Não informado"}
      </Text>
    )}
  </View>
);

const StatBadge = ({ label, value, icon, color = "bg-light-primary" }) => (
  <View className={`${color} rounded-xl p-3 flex-1 items-center`}>
    <Feather name={icon} size={20} color="white" />
    <Text className="text-white text-xl font-bold mt-1">{value}</Text>
    <Text className="text-white/80 text-xs font-medium mt-0.5">{label}</Text>
  </View>
);

export default function Perfil() {
  const navigation = useNavigation();
  const { user, updateUserContext } = useAuth();
  const { driverInfo, loading: isLoadingDriver } = useDriver();
  const insets = useSafeAreaInsets();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
      });
    }
  }, [user]);

  const handleSalvar = async () => {
    try {
      setLoading(true);
      updateUserContext({ ...user, ...formData });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
      telefone: user?.telefone || "",
    });
    setEditMode(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Conta Deletada", "Sua conta foi removida permanentemente.", [
      { text: "OK" },
    ]);
    setShowDeleteConfirm(false);
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
      <View className="flex-1 bg-light-background-secondary items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-light-foreground-muted">
          Carregando perfil...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-light-background-secondary"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {loading && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <View className="bg-light-card p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-3 text-light-foreground font-semibold">
              Salvando alterações...
            </Text>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                className="mr-3 w-10 h-10 items-center justify-center"
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={24} color="#1F2937" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-light-foreground">
                  Perfil
                </Text>
                <Text className="text-sm text-light-foreground-muted mt-1">
                  Gerencie suas informações
                </Text>
              </View>
            </View>
            {!editMode ? (
              <TouchableOpacity
                className="bg-light-primary h-10 w-10 rounded-full items-center justify-center"
                onPress={() => setEditMode(true)}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={18} color="white" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="bg-light-background-secondary h-10 px-4 rounded-full items-center justify-center"
                  onPress={handleCancelar}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={18} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-light-primary h-10 px-4 rounded-full items-center justify-center"
                  onPress={handleSalvar}
                  activeOpacity={0.7}
                >
                  <Feather name="check" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View className="px-5 mb-4">
          <View className="bg-light-card rounded-2xl p-5 border border-light-border">
            <View className="flex-row items-center">
              <View className="h-16 w-16 rounded-xl bg-light-primary items-center justify-center mr-4">
                <Text className="text-2xl font-bold text-white">
                  {getInitials(user?.nome)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-light-foreground">
                  {user?.nome || "Usuário"}
                </Text>
                <Text className="text-sm text-light-foreground-muted mt-0.5">
                  {user?.email || ""}
                </Text>
              </View>
              {driverInfo?.em_viagem ? (
                <View className="bg-light-error/10 px-3 py-1.5 rounded-full">
                  <Text className="text-xs font-semibold text-light-error">
                    Em viagem
                  </Text>
                </View>
              ) : (
                <View className="bg-light-success/10 px-3 py-1.5 rounded-full">
                  <Text className="text-xs font-semibold text-light-success">
                    Disponível
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {driverInfo && (
          <View className="px-5 mb-4">
            <View className="flex-row gap-3">
              <StatBadge
                icon="credit-card"
                label="CNH"
                value={driverInfo?.cnh ? driverInfo.cnh.slice(0, 5) : "N/A"}
                color="bg-light-success"
              />
            </View>
          </View>
        )}

        <View className="px-5 mb-4">
          <Text className="text-base font-bold text-light-foreground mb-3">
            Dados Pessoais
          </Text>
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
          <Text className="text-base font-bold text-light-foreground mb-3">
            Dados Profissionais
          </Text>
          {isLoadingDriver ? (
            <View className="bg-light-card rounded-xl p-4 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-sm text-light-foreground-muted mt-2">
                Carregando...
              </Text>
            </View>
          ) : (
            <>
              <InfoCard
                icon="credit-card"
                label="CNH"
                value={driverInfo?.cnh}
                editable={false}
              />
              <InfoCard
                icon="calendar"
                label="Vencimento CNH"
                value={formatarData(driverInfo?.vencimento)}
                editable={false}
              />
              <InfoCard
                icon="truck"
                label="Ambulância Atribuída"
                value={
                  driverInfo?.id_ambulancia
                    ? `#${String(driverInfo.id_ambulancia).slice(0, 8)}`
                    : "Aguardando atribuição"
                }
                editable={false}
              />
            </>
          )}
        </View>

        <View className="px-5 mb-6">
          <Text className="text-base font-bold text-light-foreground mb-3">
            Ações
          </Text>
          <View className="bg-light-card rounded-xl border border-light-error/30 overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() => setShowDeleteConfirm(true)}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-lg bg-light-error/10 items-center justify-center mr-3">
                <Feather name="trash-2" size={18} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-light-foreground">
                  Deletar Conta
                </Text>
                <Text className="text-xs text-light-foreground-muted mt-0.5">
                  Remove permanentemente todos os dados
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showDeleteConfirm && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center px-5">
          <View className="bg-light-card rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-light-error/10 items-center justify-center mb-3">
                <Feather name="alert-triangle" size={28} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-light-foreground mb-2">
                Deletar Conta?
              </Text>
              <Text className="text-sm text-light-foreground-muted text-center">
                Esta ação é irreversível. Todos os seus dados serão removidos
                permanentemente.
              </Text>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-light-background-secondary py-3 rounded-xl items-center"
                onPress={() => setShowDeleteConfirm(false)}
                activeOpacity={0.7}
              >
                <Text className="text-light-foreground font-semibold">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-light-error py-3 rounded-xl items-center"
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold">Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
