import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import authService from "@/services/authService";
import { useRole } from "@/hooks/use-role";
import { formatarEndereco } from "@/lib/format-utils";

export function useEnrichedTravels(travels, geocodeMap, options = {}) {
  const { getUserIdFromTravel = (t) => t.id_paciente } = options;
  const { isManager, isDriver } = useRole();

  const canFetchUserData = isManager() || isDriver();

  const userIds = useMemo(() => {
    if (!travels || travels.length === 0 || !canFetchUserData) return [];

    const ids = new Set();
    travels.forEach((t) => {
      const userId = getUserIdFromTravel(t);
      if (userId) {
        ids.add(userId);
      }
    });
    return Array.from(ids);
  }, [travels, getUserIdFromTravel, canFetchUserData]);

  const userQueries = useQueries({
    queries:
      userIds.length > 0 && canFetchUserData
        ? userIds.map((userId) => ({
            queryKey: ["user", userId],
            queryFn: () => authService.getUserById(userId),
            staleTime: 1000 * 60 * 5,
          }))
        : [],
  });

  const queriesData = canFetchUserData ? userQueries.map((q) => q.data) : [];

  const userMap = useMemo(() => {
    const map = new Map();
    if (canFetchUserData) {
      userIds.forEach((id, index) => {
        if (queriesData[index]) {
          map.set(id, queriesData[index]);
        }
      });
    }
    return map;
  }, [userIds, JSON.stringify(queriesData), canFetchUserData]);

  const enrichedTravels = useMemo(() => {
    if (!travels || travels.length === 0) return [];

    return travels.map((viagem) => {
      const userId = getUserIdFromTravel(viagem);
      const user = userMap.get(userId);
      const enderecoOrigem =
        viagem.end_inicio ||
        geocodeMap.get(
          `${viagem.lat_inicio?.toFixed(5)},${viagem.long_inicio?.toFixed(5)}`
        ) ||
        null;
      const enderecoDestino =
        viagem.end_fim ||
        geocodeMap.get(
          `${viagem.lat_fim?.toFixed(5)},${viagem.long_fim?.toFixed(5)}`
        ) ||
        null;

      return {
        ...viagem,
        _endereco_origem: enderecoOrigem
          ? formatarEndereco(enderecoOrigem)
          : null,
        _endereco_destino: enderecoDestino
          ? formatarEndereco(enderecoDestino)
          : null,
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
        (canFetchUserData && t._solicitante === null)
    );
  }, [enrichedTravels, canFetchUserData]);

  const isLoadingUsers = canFetchUserData
    ? userQueries.some((query) => query.isLoading)
    : false;

  return {
    enrichedTravels,
    isLoading: isLoadingUsers,
    hasIncompleteData,
    userMap,
  };
}
