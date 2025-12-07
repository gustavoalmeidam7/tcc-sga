import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import {
  User,
  Mail,
  Calendar,
  Phone,
  Shield,
  Pencil,
  Save,
  X,
  Users,
  Truck,
  TrendingUp,
  BarChart3,
  Trash2,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";
import authService from "@/services/authService";
import { getAmbulances } from "@/services/ambulanceService";
import { getTravels } from "@/services/travelService";
import { formatarData } from "@/lib/date-utils";
import LoadingSpinner from "@/components/layout/loading";
import { toast } from "sonner";

const InfoItem = ({
  icon: Icon,
  label,
  value,
  field,
  editable = true,
  type = "text",
  editMode,
  formData,
  setFormData,
}) => (
  <div className="group relative">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-600">
        <Icon className="h-3.5 w-3.5" />
      </div>
      {label}
    </label>
    {editMode && field && editable ? (
      <Input
        type={type}
        value={formData[field] || ""}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="h-11 border-2 focus:border-purple-500 transition-all"
      />
    ) : (
      <div className="relative">
        <p className="text-sm font-medium px-4 py-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50 group-hover:border-border transition-all">
          {value}
        </p>
      </div>
    )}
  </div>
);

export default function ManagerProfileView() {
  const { user, updateUserContext } = useAuth();
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => authService.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: ambulancesResponse } = useQuery({
    queryKey: ["ambulances"],
    queryFn: () => getAmbulances(0, 100),
    staleTime: 1000 * 60 * 5,
  });

  const ambulances = useMemo(() => {
    if (Array.isArray(ambulancesResponse)) {
      return ambulancesResponse;
    }
    return ambulancesResponse?.ambulancias || [];
  }, [ambulancesResponse]);

  const { data: travelsResponse } = useQuery({
    queryKey: ["travels"],
    queryFn: () => getTravels(100, 0),
    staleTime: 1000 * 60 * 2,
  });

  const motoristas = useMemo(() => users.filter((u) => u.cargo === 1), [users]);

  const travels = useMemo(() => {
    if (Array.isArray(travelsResponse)) {
      return travelsResponse;
    }
    return travelsResponse?.viagens || [];
  }, [travelsResponse]);

  const viagensHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return travels.filter((t) => {
      if (t.cancelada) return false;
      const dataViagem = new Date(t.inicio);
      dataViagem.setHours(0, 0, 0, 0);
      return dataViagem.getTime() === hoje.getTime();
    });
  }, [travels]);

  const handleSalvar = async () => {
    setLoading(true);

    try {
      const updateData = {
        email: formData.email,
        nome: formData.nome,
        telefone: formData.telefone,
        cargo: user?.cargo || 2,
      };

      const updatedUser = await authService.updateUser(updateData);

      if (updateUserContext) {
        updateUserContext(updatedUser);
      }

      toast.success("Perfil atualizado com sucesso!", {
        description: "Suas informações foram salvas.",
        duration: 4000,
      });
      setEditMode(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      const mensagemErro =
        err.response?.data?.detail ||
        "Erro ao atualizar perfil. Tente novamente.";
      toast.error("Erro ao atualizar perfil", {
        description: mensagemErro,
        duration: 5000,
      });
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

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (err) {
    } finally {
      setShowDeleteConfirm(false);
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

  return (
    <main className="min-h-screen bg-background">
      {loading && <LoadingSpinner fullScreen text="Salvando alterações..." />}

      <div className="relative bg-gradient-to-r from-purple-500/80 via-purple-600/90 to-purple-500/80 h-48 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,0,0,0.1),transparent)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        <Card className="mb-8 border shadow-2xl overflow-hidden bg-card">
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-500/90 via-purple-600 to-purple-500/80 flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-background">
                  {getInitials(user?.nome)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                  <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                      {user?.nome || "Usuário"}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start mb-2">
                      <Mail className="h-4 w-4" />
                      {user?.email || "Não informado"}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-semibold">
                      <Shield className="h-3.5 w-3.5" />
                      {ROLE_LABELS[user?.cargo] || "Gerente"}
                    </div>
                  </div>

                  {!editMode ? (
                    <Button
                      size="lg"
                      className="shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setEditMode(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleCancelar}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleSalvar}
                        disabled={loading}
                        className="shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border shadow-lg hover:shadow-xl transition-all bg-card">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <InfoItem
                icon={User}
                label="Nome Completo"
                value={user?.nome || "Não informado"}
                field="nome"
                type="text"
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
              <InfoItem
                icon={Mail}
                label="E-mail"
                value={user?.email || "Não informado"}
                field="email"
                type="email"
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
              <InfoItem
                icon={Phone}
                label="Telefone"
                value={user?.telefone || "Não informado"}
                field="telefone"
                type="tel"
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
            </CardContent>
          </Card>

          <Card className="border shadow-lg hover:shadow-xl transition-all bg-card">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <InfoItem
                icon={CreditCard}
                label="CPF"
                value={user?.cpf || "Não informado"}
                editable={false}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
              <InfoItem
                icon={Calendar}
                label="Data de Nascimento"
                value={formatarData(user?.nascimento)}
                editable={false}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border shadow-lg bg-card">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              Visão Geral da Gestão
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Motoristas Ativos
                  </span>
                </div>
                <span className="text-3xl font-bold">{motoristas.length}</span>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Ambulâncias
                  </span>
                </div>
                <span className="text-3xl font-bold">
                  {ambulances.length || 0}
                </span>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Viagens Hoje
                  </span>
                </div>
                <span className="text-3xl font-bold text-green-500">
                  {viagensHoje.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/30 bg-destructive/5 shadow-lg">
          <CardHeader className="border-b border-destructive/20 bg-destructive/10 p-3">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <div className="p-1 bg-destructive/20 rounded flex-shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              Zona de Perigo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div>
              <h3 className="font-semibold text-sm mb-1">Deletar Conta</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Todos os seus dados serão removidos permanentemente.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="shadow-md"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Deletar Conta
                </Button>
              ) : (
                <div className="space-y-3 p-3 border-2 border-destructive/50 rounded-lg bg-card shadow-inner">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-destructive/20 rounded flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5">Tem certeza?</p>
                      <p className="text-xs text-muted-foreground">
                        Esta ação é irreversível.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 shadow-md"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
