import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getTravels, deleteTravel } from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createColumns } from "./columns";
import { useRole } from "@/hooks/use-role";
import { ROLES } from "@/lib/roles";
import { TravelStatus, TRAVEL_STATUS_LABELS } from "@/lib/travel-status";
import FilterPanel from "./components/FilterPanel";
import DeleteTravelDialog from "./components/DeleteTravelDialog";
import { reverseGeocode } from "@/hooks/useReverseGeocode";
import authService from "@/services/authService";

function Agendamentos() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userRole } = useRole();
  const [viagemExcluir, setViagemExcluir] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [filtrosAvancadosAbertos, setFiltrosAvancadosAbertos] = useState(false);

  const isManager = userRole === ROLES.MANAGER;

  const {
    data: viagens = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["travels", "user"],
    queryFn: () => getTravels(100, 0),
    staleTime: 1000 * 60 * 2,
  });

  const viagensAtivas = useMemo(
    () =>
      viagens.filter(
        (v) =>
          v.realizado === TravelStatus.NAO_REALIZADO ||
          v.realizado === TravelStatus.EM_PROGRESSO
      ),
    [viagens]
  );

  const geocodeQueries = useQueries({
    queries: viagensAtivas.flatMap((t) => [
      {
        queryKey: ["geocode", t.lat_inicio, t.long_inicio],
        queryFn: () => reverseGeocode(t.lat_inicio, t.long_inicio),
        enabled: !!(t.lat_inicio && t.long_inicio),
        staleTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["geocode", t.lat_fim, t.long_fim],
        queryFn: () => reverseGeocode(t.lat_fim, t.long_fim),
        enabled: !!(t.lat_fim && t.long_fim),
        staleTime: 1000 * 60 * 30,
      },
    ]),
  });

  const userIds = useMemo(() => {
    const ids = new Set();
    viagensAtivas.forEach((t) => t.id_paciente && ids.add(t.id_paciente));
    return Array.from(ids);
  }, [viagensAtivas]);

  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["user", userId],
      queryFn: () => authService.getUserById(userId),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const enrichedViagens = useMemo(() => {
    const userMap = new Map();
    userIds.forEach((id, index) => {
      if (userQueries[index]?.data) {
        userMap.set(id, userQueries[index].data);
      }
    });

    return viagensAtivas.map((viagem, index) => {
      const origemIndex = index * 2;
      const destinoIndex = index * 2 + 1;

      return {
        ...viagem,
        _endereco_origem: geocodeQueries[origemIndex]?.data || null,
        _endereco_destino: geocodeQueries[destinoIndex]?.data || null,
        _solicitante: userMap.get(viagem.id_paciente)?.nome || null,
      };
    });
  }, [viagensAtivas, geocodeQueries, userQueries, userIds]);

  const isLoadingData = useMemo(() => {
    if (loading) return true;

    const hasIncompleteData = enrichedViagens.some(
      (t) =>
        t._endereco_origem === null ||
        t._endereco_destino === null ||
        t._solicitante === null
    );

    return hasIncompleteData;
  }, [loading, enrichedViagens]);

  const deleteMutation = useMutation({
    mutationFn: deleteTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      setViagemExcluir(null);
      toast.error("Viagem excluída com sucesso!", {
        description: "O agendamento foi removido da lista.",
        duration: 4000,
      });
    },
    onError: (error) => {
      const mensagemErro = error.response?.data?.Erros
        ? Object.values(error.response.data.Erros).join(", ")
        : error.message || "Erro ao excluir viagem";

      toast.error("Erro ao excluir viagem", {
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
      toast.error("Erro ao carregar viagens", {
        description:
          queryError.message || "Não foi possível carregar seus agendamentos.",
        duration: 5000,
      });
    }
  }, [queryError]);

  const viagensFiltradas = useMemo(() => {
    let filtradas = enrichedViagens;

    if (statusFilter !== null) {
      filtradas = filtradas.filter((v) => v.realizado === statusFilter);
    }

    if (dataInicio) {
      filtradas = filtradas.filter((v) => {
        const dataViagem = new Date(v.inicio).toISOString().split("T")[0];
        return dataViagem >= dataInicio;
      });
    }

    if (dataFim) {
      filtradas = filtradas.filter((v) => {
        const dataViagem = new Date(v.inicio).toISOString().split("T")[0];
        return dataViagem <= dataFim;
      });
    }

    return filtradas;
  }, [enrichedViagens, statusFilter, dataInicio, dataFim]);

  const columns = useMemo(
    () => createColumns(setViagemExcluir, navigate),
    [navigate]
  );

  const statusOptions = useMemo(
    () => [
      { value: null, label: "Todos os Status", count: viagensAtivas.length },
      {
        value: TravelStatus.NAO_REALIZADO,
        label: TRAVEL_STATUS_LABELS[TravelStatus.NAO_REALIZADO],
        count: viagensAtivas.filter(
          (v) => v.realizado === TravelStatus.NAO_REALIZADO
        ).length,
      },
      {
        value: TravelStatus.EM_PROGRESSO,
        label: TRAVEL_STATUS_LABELS[TravelStatus.EM_PROGRESSO],
        count: viagensAtivas.filter(
          (v) => v.realizado === TravelStatus.EM_PROGRESSO
        ).length,
      },
    ],
    [viagensAtivas]
  );

  const hasActiveFilters = statusFilter !== null || dataInicio || dataFim;

  const handleLimparFiltros = () => {
    setStatusFilter(null);
    setDataInicio("");
    setDataFim("");
  };

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
          <FilterPanel
            statusOptions={statusOptions}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            filtrosAvancadosAbertos={filtrosAvancadosAbertos}
            onToggleFiltrosAvancados={() =>
              setFiltrosAvancadosAbertos(!filtrosAvancadosAbertos)
            }
            dataInicio={dataInicio}
            dataFim={dataFim}
            onDataInicioChange={setDataInicio}
            onDataFimChange={setDataFim}
            onLimparFiltros={handleLimparFiltros}
            hasActiveFilters={hasActiveFilters}
          />

          <DataTable
            columns={columns}
            data={viagensFiltradas}
            isLoading={isLoadingData}
          />
        </CardContent>
      </Card>

      <DeleteTravelDialog
        viagem={viagemExcluir}
        isOpen={!!viagemExcluir}
        isPending={deleteMutation.isPending}
        onClose={() => setViagemExcluir(null)}
        onConfirm={handleExcluir}
      />
    </main>
  );
}

export default Agendamentos;
