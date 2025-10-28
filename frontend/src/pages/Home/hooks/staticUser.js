import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getTravels } from "@/services/travelService";
import { formatarDataHora } from "@/lib/date-utils";
import { TravelStatus } from "@/lib/travel-status";
import { reverseGeocode } from "@/hooks/useReverseGeocode";

export function useUserDashboard() {
  const {
    data: viagens = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["travels", "user"],
    queryFn: () => getTravels(100, 0),
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

  const geocodeQueries = useQueries({
    queries: proximasViagensList.flatMap((v) => [
      {
        queryKey: ["geocode", v.lat_inicio, v.long_inicio],
        queryFn: () => reverseGeocode(v.lat_inicio, v.long_inicio),
        enabled: !!(v.lat_inicio && v.long_inicio),
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
      },
      {
        queryKey: ["geocode", v.lat_fim, v.long_fim],
        queryFn: () => reverseGeocode(v.lat_fim, v.long_fim),
        enabled: !!(v.lat_fim && v.long_fim),
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
      },
    ]),
  });

  const dashboardData = useMemo(() => {
    const stats = {
      pendentes: viagens.filter(
        (v) => v.realizado === TravelStatus.NAO_REALIZADO
      ).length,
      concluidas: viagens.filter((v) => v.realizado === TravelStatus.REALIZADO)
        .length,
      total: viagens.length,
    };

    const proximasViagens = proximasViagensList.map((v, index) => {
      const origemIndex = index * 2;
      const destinoIndex = index * 2 + 1;

      return {
        id: v.id,
        dataHoraCompleta: formatarDataHora(v.inicio),
        dataISO: v.inicio,
        origem: geocodeQueries[origemIndex]?.data || "Carregando...",
        destino: geocodeQueries[destinoIndex]?.data || "Carregando...",
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
  }, [viagens, proximasViagensList, geocodeQueries]);

  return {
    dashboardData,
    loading,
    error,
  };
}
