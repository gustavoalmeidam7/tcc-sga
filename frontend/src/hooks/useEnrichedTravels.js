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

  const userMap = useMemo(() => {
    const map = new Map();
    userIds.forEach((id, index) => {
      if (userQueries[index]?.data) {
        map.set(id, userQueries[index].data);
      }
    });
    return map;
  }, [userIds, userQueries]);

  const enrichedTravels = useMemo(() => {
    if (!travels || travels.length === 0) return [];

    return travels.map((viagem) => {
      const userId = getUserIdFromTravel(viagem);
      const user = userMap.get(userId);

      return {
        ...viagem,
        _endereco_origem:
          geocodeMap.get(`${viagem.lat_inicio},${viagem.long_inicio}`) || null,
        _endereco_destino:
          geocodeMap.get(`${viagem.lat_fim},${viagem.long_fim}`) || null,
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
