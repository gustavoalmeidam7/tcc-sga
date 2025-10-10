import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Calendar, Phone, Shield, Pencil, Save, X, AlertCircle } from "lucide-react";
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

export default function UserProfileView() {
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
        cargo: user?.cargo || 0,
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
            👤 Meu Perfil
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações pessoais e acompanhe sua atividade
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Dicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Mantenha suas informações de contato atualizadas</p>
            <p>• Verifique regularmente seu perfil para garantir que tudo esteja correto</p>
            <p>• Entre em contato com o suporte se precisar de ajuda</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}