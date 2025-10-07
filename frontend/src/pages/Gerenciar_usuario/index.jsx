import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Pencil } from "lucide-react";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import authService from "@/services/authService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatarData } from "@/lib/date-utils";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [novoCargo, setNovoCargo] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.getAllUsers();
      const dados = Array.isArray(response) ? response : (response.data || []);
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  const getRoleBadgeColor = (cargo) => {
    const colors = {
      0: "bg-blue-500 hover:bg-blue-600",    // USER
      1: "bg-orange-500 hover:bg-orange-600", // DRIVER
      2: "bg-purple-500 hover:bg-purple-600", // MANAGER
    };
    return colors[cargo] || "bg-gray-500";
  };

  const handleEditarCargo = (usuario) => {
    setUsuarioEdit(usuario);
    setNovoCargo(usuario.cargo.toString());
  };

  const handleSalvarCargo = async () => {
    if (!usuarioEdit) return;

    // TODO: Implementar quando backend tiver endpoint para gerente atualizar cargo de outros usuários
    // Por enquanto, apenas fecha o modal
    console.log("Atualizar cargo do usuário:", usuarioEdit.id, "para:", novoCargo);
    setUsuarioEdit(null);
    setNovoCargo("");
  };

  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.nome}</div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.email}</div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "nascimento",
      header: "Data de Nascimento",
      cell: ({ row }) => (
        <div>{formatarData(row.original.nascimento)}</div>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "cargo",
      header: "Cargo",
      cell: ({ row }) => {
        const cargo = row.original.cargo;
        return (
          <Badge className={getRoleBadgeColor(cargo)}>
            {ROLE_LABELS[cargo] || "Desconhecido"}
          </Badge>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const cargoLabel = ROLE_LABELS[row.original.cargo] || "";
        return cargoLabel.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditarCargo(row.original)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Editar Cargo
        </Button>
      ),
      enableColumnFilter: false,
    },
  ];

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            👥 Gerenciamento de Usuários
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      {/* Error */}
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

      {/* DataTable */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={usuarios}
              filterColumn="nome"
              filterPlaceholder="Buscar por nome..."
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição de Cargo */}
      <Dialog open={!!usuarioEdit} onOpenChange={() => setUsuarioEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cargo do Usuário</DialogTitle>
            <DialogDescription>
              Altere o cargo de {usuarioEdit?.nome}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo Atual</label>
              <div className="flex items-center gap-2">
                <Badge className={getRoleBadgeColor(usuarioEdit?.cargo)}>
                  {ROLE_LABELS[usuarioEdit?.cargo]}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Novo Cargo</label>
              <Select value={novoCargo} onValueChange={setNovoCargo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLES.USER.toString()}>
                    {ROLE_LABELS[ROLES.USER]}
                  </SelectItem>
                  <SelectItem value={ROLES.DRIVER.toString()}>
                    {ROLE_LABELS[ROLES.DRIVER]}
                  </SelectItem>
                  <SelectItem value={ROLES.MANAGER.toString()}>
                    {ROLE_LABELS[ROLES.MANAGER]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUsuarioEdit(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarCargo}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Usuarios;
