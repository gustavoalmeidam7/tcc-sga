import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Calendar, Phone, Shield, Pencil, Save, X, AlertCircle, Users, Truck, TrendingUp, BarChart3 } from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";
import authService from "@/services/authService";
import { formatarData } from "@/lib/date-utils";
import LoadingSpinner from "@/components/layout/loading";

const InfoItem = ({ icon: Icon, label, value, field, editable = true, type = "text", editMode, formData, setFormData }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {editMode && field && editable ? (
        <Input
          type={type}
          value={formData[field] || ""}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="mt-1"
        />
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  </div>
);

export default function ManagerProfileView() {
  const { user, updateUserContext } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
  });

  const handleSalvar = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

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

      setSuccess("Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.response?.data?.detail || "Erro ao atualizar perfil. Tente novamente.");
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
    setError("");
    setSuccess("");
    setEditMode(false);
  };

  return (
    <main className="space-y-6 lg:container lg:mx-auto pb-6">
      {loading && <LoadingSpinner fullScreen text="Salvando alterações..." />}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            👔 Meu Perfil - Gerente
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações e acompanhe sua equipe
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            {!editMode ? (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelar} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSalvar} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem icon={User} label="Nome Completo" value={user?.nome || "Não informado"} field="nome" type="text" editMode={editMode} formData={formData} setFormData={setFormData} />
            <InfoItem icon={Mail} label="E-mail" value={user?.email || "Não informado"} field="email" type="email" editMode={editMode} formData={formData} setFormData={setFormData} />
            <InfoItem icon={Phone} label="Telefone" value={user?.telefone || "Não informado"} field="telefone" type="tel" editMode={editMode} formData={formData} setFormData={setFormData} />
            <InfoItem icon={Calendar} label="Data de Nascimento" value={formatarData(user?.nascimento)} editable={false} editMode={editMode} formData={formData} setFormData={setFormData} />
            <InfoItem icon={Shield} label="Cargo" value={ROLE_LABELS[user?.cargo] || "Não informado"} editable={false} editMode={editMode} formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">Motoristas Ativos</span>
                </div>
                <span className="text-xl font-bold">{user?.motoristasAtivos || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">Ambulâncias</span>
                </div>
                <span className="text-xl font-bold">{user?.totalAmbulancia || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-sm">Viagens Hoje</span>
                </div>
                <span className="text-xl font-bold text-green-500">{user?.viagensHoje || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Dicas de Gestão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Mantenha suas informações de contato atualizadas para facilitar a comunicação com a equipe</p>
            <p>• Acesse o painel de gestão para visualizar relatórios detalhados</p>
            <p>• Configure notificações para acompanhar as viagens em tempo real</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}