import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAssignedTravels } from "@/services/travelService";
import { formatarDataHora } from "@/lib/date-utils";
import { TravelStatus } from "@/lib/travel-status";
import { useGeocodeQueries } from "@/hooks/useGeocodeQueries";

export function useUserDashboard() {
  const {
    data: viagens = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["travels", "assigned"],
    queryFn: () => getAssignedTravels(100, 0),
    staleTime: 1000 * 60 * 2,
  });

  const viagensAtivas = useMemo(
    () => viagens.filter((v) => v.realizado !== TravelStatus.REALIZADO),
    [viagens]
  );

  const proximasViagensList = useMemo(() => {
    return viagensAtivas
      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
      .slice(0, 3);
  }, [viagensAtivas]);

  const { geocodeMap, isLoading: isLoadingGeocodes } =
    useGeocodeQueries(proximasViagensList);

  const dashboardData = useMemo(() => {
    const stats = {
      pendentes: viagens.filter(
        (v) => v.realizado === TravelStatus.NAO_REALIZADO
      ).length,
      concluidas: viagens.filter((v) => v.realizado === TravelStatus.REALIZADO)
        .length,
      total: viagens.length,
    };

    const proximasViagens = proximasViagensList.map((v) => {
      const enderecoOrigem = geocodeMap.get(
        `${v.lat_inicio.toFixed(5)},${v.long_inicio.toFixed(5)}`
      );
      const enderecoDestino = geocodeMap.get(
        `${v.lat_fim.toFixed(5)},${v.long_fim.toFixed(5)}`
      );

      return {
        id: v.id,
        dataHoraCompleta: formatarDataHora(v.inicio),
        dataISO: v.inicio,
        origem: enderecoOrigem || "Carregando...",
        destino: enderecoDestino || "Carregando...",
        status:
          v.realizado === TravelStatus.NAO_REALIZADO
            ? "pendente"
            : v.realizado === TravelStatus.EM_PROGRESSO
            ? "em andamento"
            : "concluída",
        paciente: v.nome_paciente,
      };
    });

    return { stats, proximasViagens };
  }, [viagens, proximasViagensList, geocodeMap]);

  return {
    dashboardData,
    loading: loading || isLoadingGeocodes,
    error,
  };
}
