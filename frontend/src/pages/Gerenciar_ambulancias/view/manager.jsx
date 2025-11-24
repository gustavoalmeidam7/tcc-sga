import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Ambulance as AmbulanceIcon,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getAmbulanceStatusLabel,
  getAmbulanceTypeLabel,
  getAmbulanceStatusColors,
} from "@/lib/ambulance";
import {
  getAmbulances,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
} from "@/services/ambulanceService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { CreateAmbulanceModal } from "../components/modals/CreateAmbulanceModal";
import { EditAmbulanceModal } from "../components/modals/EditAmbulanceModal";
import { TextAnimate } from "@/components/ui/text-animate";

export default function ManagerAmbulanciasView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ambulanceToDelete, setAmbulanceToDelete] = useState(null);

  const {
    data: ambulanciasResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ambulances"],
    queryFn: () => getAmbulances(0, 100),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const ambulancias = Array.isArray(ambulanciasResponse)
    ? ambulanciasResponse
    : ambulanciasResponse?.ambulancias || [];

  const getStatusBadgeColor = (status) => {
    const colors = getAmbulanceStatusColors(status);
    return colors.className;
  };

  const handleEditAmbulance = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setIsEditModalOpen(true);
  };

  const createAmbulanceMutation = useMutation({
    mutationFn: createAmbulance,
    onSuccess: () => {
      queryClient.invalidateQueries(["ambulances"]);
      toast.success("Ambulância criada!", {
        description: "A ambulância foi cadastrada com sucesso.",
        duration: 3000,
      });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao criar ambulância:", error);
      toast.error("Erro ao criar ambulância", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível cadastrar a ambulância. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const updateAmbulanceMutation = useMutation({
    mutationFn: ({ id, data }) => updateAmbulance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["ambulances"]);
      toast.success("Ambulância atualizada!", {
        description: "As alterações foram salvas com sucesso.",
        duration: 3000,
      });
      setIsEditModalOpen(false);
      setSelectedAmbulance(null);
    },
    onError: (error) => {
      console.error("Erro ao atualizar ambulância:", error);
      toast.error("Erro ao atualizar ambulância", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível salvar as alterações. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const deleteAmbulanceMutation = useMutation({
    mutationFn: deleteAmbulance,
    onSuccess: () => {
      queryClient.invalidateQueries(["ambulances"]);
      toast.success("Ambulância excluída!", {
        description: "A ambulância foi removida do sistema com sucesso.",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setAmbulanceToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir ambulância:", error);
      toast.error("Erro ao excluir ambulância", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível excluir a ambulância. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const handleCreateAmbulance = async (ambulanceData) => {
    createAmbulanceMutation.mutate(ambulanceData);
  };

  const handleUpdateAmbulance = async (id, ambulanceData) => {
    updateAmbulanceMutation.mutate({ id, data: ambulanceData });
  };

  const handleDeleteAmbulance = (ambulance) => {
    setAmbulanceToDelete(ambulance);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAmbulance = () => {
    if (ambulanceToDelete) {
      deleteAmbulanceMutation.mutate(ambulanceToDelete.id);
    }
  };

  const columns = [
    {
      accessorKey: "placa",
      header: "Placa",
      cell: ({ row }) => (
        <div className="font-mono font-medium text-foreground">
          {row.original.placa}
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {getAmbulanceTypeLabel(row.original.tipo)}
        </div>
      ),
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const tipoLabel = getAmbulanceTypeLabel(row.original.tipo) || "";
        return tipoLabel.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={getStatusBadgeColor(status)}>
            {getAmbulanceStatusLabel(status)}
          </Badge>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const statusLabel = getAmbulanceStatusLabel(row.original.status) || "";
        return statusLabel.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "equipamentos",
      header: "Equipamentos",
      cell: ({ row }) => {
        const equipamentos = row.original.equipamentos;
        const count = Array.isArray(equipamentos)
          ? equipamentos.length
          : equipamentos && typeof equipamentos === "object"
          ? 1
          : 0;
        return (
          <div className="text-sm text-muted-foreground">
            {count > 0
              ? `${count} equipamento${count > 1 ? "s" : ""}`
              : "Nenhum"}
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigate(`/detalhes/ambulancias/${row.original.id}`)
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteAmbulance(row.original)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableColumnFilter: false,
    },
  ];

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AmbulanceIcon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              <TextAnimate
                animation="blurInUp"
                by="character"
                once
                delay={0.15}
                accessible={false}
                className="text-2xl md:text-2xl font-bold text-foreground"
              >
                Gerenciamento de Ambulâncias
              </TextAnimate>
            </div>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie todas as ambulâncias do sistema
            </p>
          </div>
          <Button
            className="flex-shrink-0"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Ambulância
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      {isLoading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : ambulancias.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={ambulancias}
              filterColumn="placa"
              filterPlaceholder="Buscar por placa..."
            />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-destructive/10 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Erro ao carregar ambulâncias
              </h3>
              <p className="text-muted-foreground mb-4">
                {error.response?.status === 401
                  ? "Você não tem permissão para visualizar ambulâncias."
                  : "Não foi possível carregar as ambulâncias. Tente novamente."}
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AmbulanceIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma ambulância cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece cadastrando sua primeira ambulância no sistema.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Ambulância
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateAmbulanceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onAmbulanceCreated={handleCreateAmbulance}
      />

      <EditAmbulanceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        ambulance={selectedAmbulance}
        onAmbulanceUpdated={handleUpdateAmbulance}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-foreground">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  Tem certeza que deseja excluir a ambulância{" "}
                  <strong className="font-mono">
                    {ambulanceToDelete?.placa}
                  </strong>
                  ? Esta ação não pode ser desfeita.
                </p>
                <div className="rounded-lg bg-destructive/20 border border-destructive/30 p-3">
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ Todos os dados relacionados a esta ambulância serão
                    permanentemente removidos do sistema.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAmbulance}
              disabled={deleteAmbulanceMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteAmbulanceMutation.isPending
                ? "Excluindo..."
                : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
