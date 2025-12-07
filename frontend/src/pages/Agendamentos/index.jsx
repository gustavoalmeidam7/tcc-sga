import { useState, useMemo, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTravels,
  getAssignedTravels,
  cancelTravel,
} from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createColumns } from "./columns";
import { useRole } from "@/hooks/use-role";
import { ROLES } from "@/lib/roles";
import { TravelStatus, TRAVEL_STATUS_LABELS } from "@/lib/travel-status";
import FilterPanel from "./components/FilterPanel";
import DeleteTravelDialog from "./components/DeleteTravelDialog";
import { useGeocodeQueries } from "@/hooks/useGeocodeQueries";
import { useEnrichedTravels } from "@/hooks/useEnrichedTravels";
import { showErrorToast, showSuccessToast } from "@/lib/error-utils";

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
    queryKey: ["travels", isManager ? "all" : "assigned"],
    queryFn: () =>
      isManager ? getTravels(100, 0) : getAssignedTravels(100, 0),
    staleTime: 1000 * 60 * 2,
  });

  const viagensAtivas = useMemo(
    () =>
      viagens.filter(
        (v) =>
          !v.cancelada &&
          (v.realizado === TravelStatus.NAO_REALIZADO ||
            v.realizado === TravelStatus.EM_PROGRESSO)
      ),
    [viagens]
  );

  const { geocodeMap } = useGeocodeQueries(viagensAtivas);
  const { enrichedTravels: enrichedViagens, hasIncompleteData } =
    useEnrichedTravels(viagensAtivas, geocodeMap);

  const isLoadingData = loading || hasIncompleteData;

  const cancelMutation = useMutation({
    mutationFn: cancelTravel,
    onSuccess: (response, canceledTravelId) => {
      queryClient.setQueriesData({ queryKey: ["travels"] }, (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map((v) =>
            v.id === canceledTravelId ? { ...v, cancelada: true } : v
          );
        }
        return oldData;
      });

      queryClient.invalidateQueries({ queryKey: ["travels"] });
      queryClient.invalidateQueries({ queryKey: ["travel", canceledTravelId] });

      setViagemExcluir(null);
      showSuccessToast("Viagem cancelada!", {
        description: "O agendamento foi cancelado e movido para o histórico.",
      });
    },
    onError: (error) => {
      showErrorToast(error, "Erro ao cancelar viagem", {
        defaultMessage: "Não foi possível cancelar a viagem. Tente novamente.",
      });
    },
  });

  const handleCancelar = () => {
    if (!viagemExcluir) return;
    cancelMutation.mutate(viagemExcluir.id);
  };

  useEffect(() => {
    if (queryError) {
      showErrorToast(queryError, "Erro ao carregar viagens", {
        defaultMessage: "Não foi possível carregar seus agendamentos.",
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
        isPending={cancelMutation.isPending}
        onClose={() => setViagemExcluir(null)}
        onConfirm={handleCancelar}
      />
    </main>
  );
}

export default memo(Agendamentos);
