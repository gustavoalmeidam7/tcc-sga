import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTravels } from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, History } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { TravelStatus } from "@/lib/travel-status";
import { createColumnsHistorico } from "./columns";
import { reverseGeocode } from "@/hooks/useReverseGeocode";
import authService from "@/services/authService";

function Historico() {
  const navigate = useNavigate();

  const {
    data: viagens = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["travels", "historico"],
    queryFn: () => getTravels(50, 0),
    staleTime: 1000 * 60 * 5,
  });

  const viagensConcluidas = useMemo(
    () => viagens.filter((v) => v.realizado === TravelStatus.REALIZADO),
    [viagens]
  );

  const geocodeQueries = useQueries({
    queries: viagensConcluidas.flatMap((t) => [
      {
        queryKey: ["geocode", t.lat_inicio, t.long_inicio],
        queryFn: () => reverseGeocode(t.lat_inicio, t.long_inicio),
        enabled: !!(t.lat_inicio && t.long_inicio),
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
      },
      {
        queryKey: ["geocode", t.lat_fim, t.long_fim],
        queryFn: () => reverseGeocode(t.lat_fim, t.long_fim),
        enabled: !!(t.lat_fim && t.long_fim),
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
      },
    ]),
  });

  const userIds = useMemo(() => {
    const ids = new Set();
    viagensConcluidas.forEach((t) => t.id_paciente && ids.add(t.id_paciente));
    return Array.from(ids);
  }, [viagensConcluidas]);

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

    return viagensConcluidas.map((viagem, index) => {
      const origemIndex = index * 2;
      const destinoIndex = index * 2 + 1;

      return {
        ...viagem,
        _endereco_origem: geocodeQueries[origemIndex]?.data || null,
        _endereco_destino: geocodeQueries[destinoIndex]?.data || null,
        _solicitante: userMap.get(viagem.id_paciente)?.nome || null,
      };
    });
  }, [viagensConcluidas, geocodeQueries, userQueries, userIds]);

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

  useEffect(() => {
    if (queryError) {
      toast.error("Erro ao carregar histórico", {
        description:
          queryError.message ||
          "Não foi possível carregar o histórico de viagens.",
        duration: 5000,
      });
    }
  }, [queryError]);

  const columns = useMemo(() => createColumnsHistorico(navigate), [navigate]);

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10 flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
              Histórico de Viagens
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize todas as viagens concluídas
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : enrichedViagens.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma viagem concluída
              </h3>
              <p className="text-sm text-muted-foreground">
                Quando as viagens forem concluídas, elas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {enrichedViagens.length}{" "}
                  {enrichedViagens.length === 1
                    ? "viagem concluída"
                    : "viagens concluídas"}
                </p>
              </div>
              <DataTable
                columns={columns}
                data={enrichedViagens}
                filterColumn="_endereco_origem"
                filterPlaceholder="Buscar por origem..."
                isLoading={isLoadingData}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default Historico;
