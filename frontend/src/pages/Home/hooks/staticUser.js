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

  const uniqueCoordinates = useMemo(() => {
    if (proximasViagensList.length === 0) return [];

    const coordsMap = new Map();
    proximasViagensList.forEach((v) => {
      if (v.lat_inicio && v.long_inicio) {
        const key = `${v.lat_inicio},${v.long_inicio}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: v.lat_inicio, long: v.long_inicio });
        }
      }
      if (v.lat_fim && v.long_fim) {
        const key = `${v.lat_fim},${v.long_fim}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: v.lat_fim, long: v.long_fim });
        }
      }
    });
    return Array.from(coordsMap.values());
  }, [proximasViagensList]);

  const geocodeQueries = useQueries({
    queries: uniqueCoordinates.map((coord) => ({
      queryKey: ["geocode", coord.lat, coord.long],
      queryFn: () => reverseGeocode(coord.lat, coord.long),
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24 * 7,
    })),
  });

  const geocodeMap = useMemo(() => {
    const map = new Map();
    uniqueCoordinates.forEach((coord, index) => {
      const key = `${coord.lat},${coord.long}`;
      map.set(key, geocodeQueries[index]?.data);
    });
    return map;
  }, [uniqueCoordinates, geocodeQueries]);

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
      return {
        id: v.id,
        dataHoraCompleta: formatarDataHora(v.inicio),
        dataISO: v.inicio,
        origem: geocodeMap.get(`${v.lat_inicio},${v.long_inicio}`) || "Carregando...",
        destino: geocodeMap.get(`${v.lat_fim},${v.long_fim}`) || "Carregando...",
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
    loading,
    error,
  };
}
