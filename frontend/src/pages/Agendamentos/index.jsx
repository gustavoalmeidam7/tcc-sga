import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravels, deleteTravel } from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarDataHora } from "@/lib/date-utils";
import { createColumns } from "./columns";
import { useRole } from "@/hooks/use-role";
import { ROLES } from "@/lib/roles";
import { TravelStatus, TRAVEL_STATUS_LABELS } from "@/lib/travel-status";

function Agendamentos() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userRole } = useRole();
  const [viagemExcluir, setViagemExcluir] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const isManager = userRole === ROLES.MANAGER;

  const {
    data: viagens = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ['travels', 'user'],
    queryFn: () => getTravels(100, 0),
    staleTime: 1000 * 60 * 2, 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travels'] });
      setViagemExcluir(null);
      toast.error('Viagem excluída com sucesso!', {
        description: 'O agendamento foi removido da lista.',
        duration: 4000,
      });
    },
    onError: (error) => {
      const mensagemErro = error.response?.data?.Erros
        ? Object.values(error.response.data.Erros).join(", ")
        : error.message || "Erro ao excluir viagem";

      toast.error('Erro ao excluir viagem', {
        description: mensagemErro,
        duration: 5000,
      });
    },
  });

  const handleExcluir = () => {
    if (!viagemExcluir) return;
    deleteMutation.mutate(viagemExcluir.id);
  };

  useEffect(() => {
    if (queryError) {
      toast.error('Erro ao carregar viagens', {
        description: queryError.message || 'Não foi possível carregar seus agendamentos.',
        duration: 5000,
      });
    }
  }, [queryError]);

  const viagensFiltradas = useMemo(() => {
    if (statusFilter === null) return viagens;
    return viagens.filter(v => v.realizado === statusFilter);
  }, [viagens, statusFilter]);

  const columns = useMemo(() => createColumns(setViagemExcluir, navigate), [navigate]);

  const statusOptions = [
    { value: null, label: "Todos os Status", count: viagens.length },
    { value: TravelStatus.NAO_REALIZADO, label: TRAVEL_STATUS_LABELS[TravelStatus.NAO_REALIZADO], count: viagens.filter(v => v.realizado === TravelStatus.NAO_REALIZADO).length },
    { value: TravelStatus.EM_PROGRESSO, label: TRAVEL_STATUS_LABELS[TravelStatus.EM_PROGRESSO], count: viagens.filter(v => v.realizado === TravelStatus.EM_PROGRESSO).length },
  ];

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            {isManager ? "🎯 Painel de Viagens" : "📋 Meus Agendamentos"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isManager
              ? "Gerencie todas as viagens do sistema e atribua motoristas"
              : "Gerencie suas viagens agendadas"}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="mb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filtrar por status:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <Badge
                      key={option.value ?? 'all'}
                      variant={statusFilter === option.value ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5"
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label} ({option.count})
                    </Badge>
                  ))}
                  {statusFilter !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusFilter(null)}
                      className="h-7 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
              <DataTable
                columns={columns}
                data={viagensFiltradas}
                filterColumn="local_inicio"
                filterPlaceholder="Buscar por origem..."
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viagemExcluir} onOpenChange={() => setViagemExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento?
            </DialogDescription>
          </DialogHeader>

          {viagemExcluir && (
            <div className="space-y-2 py-4">
              <p className="text-sm text-foreground">
                <strong>Data:</strong> {formatarDataHora(viagemExcluir.inicio)}
              </p>
              <p className="text-sm text-foreground">
                <strong>Origem:</strong> {viagemExcluir.local_inicio}
              </p>
              <p className="text-sm text-foreground">
                <strong>Destino:</strong> {viagemExcluir.local_fim}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViagemExcluir(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluir}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Agendamentos;
