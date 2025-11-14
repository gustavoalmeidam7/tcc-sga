import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import authService from "@/services/authService";

export function useEnrichedTravels(travels, geocodeMap, options = {}) {
  const { getUserIdFromTravel = (t) => t.id_paciente } = options;

  const userIds = useMemo(() => {
    if (!travels || travels.length === 0) return [];

    const ids = new Set();
    travels.forEach((t) => {
      const userId = getUserIdFromTravel(t);
      if (userId) ids.add(userId);
    });
    return Array.from(ids);
  }, [travels, getUserIdFromTravel]);

  const userQueries = useQueries({
    queries:
      userIds.length > 0
        ? userIds.map((userId) => ({
            queryKey: ["user", userId],
            queryFn: () => authService.getUserById(userId),
            staleTime: 1000 * 60 * 5,
          }))
        : [],
  });

  const queriesData = userQueries.map(q => q.data);

  const userMap = useMemo(() => {
    const map = new Map();
    userIds.forEach((id, index) => {
      if (queriesData[index]) {
        map.set(id, queriesData[index]);
      }
    });
    return map;
  }, [userIds, JSON.stringify(queriesData)]);

  const enrichedTravels = useMemo(() => {
    if (!travels || travels.length === 0) return [];

    return travels.map((viagem) => {
      const userId = getUserIdFromTravel(viagem);
      const user = userMap.get(userId);

      return {
        ...viagem,
        _endereco_origem:
          geocodeMap.get(`${viagem.lat_inicio.toFixed(5)},${viagem.long_inicio.toFixed(5)}`) || null,
        _endereco_destino:
          geocodeMap.get(`${viagem.lat_fim.toFixed(5)},${viagem.long_fim.toFixed(5)}`) || null,
        _solicitante: user?.nome || null,
        _solicitante_completo: user || null,
      };
    });
  }, [travels, geocodeMap, userMap, getUserIdFromTravel]);

  const hasIncompleteData = useMemo(() => {
    return enrichedTravels.some(
      (t) =>
        t._endereco_origem === null ||
        t._endereco_destino === null ||
        t._solicitante === null
    );
  }, [enrichedTravels]);

  const isLoadingUsers = userQueries.some((query) => query.isLoading);

  return {
    enrichedTravels,
    isLoading: isLoadingUsers,
    hasIncompleteData,
    userMap,
  };
}
