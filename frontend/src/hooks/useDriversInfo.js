import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAmbulances, getAmbulanceById } from "@/services/ambulanceService";

export function useDriversInfo(motoristas) {
  const { data: ambulancesResponse } = useQuery({
    queryKey: ["ambulances"],
    queryFn: () => getAmbulances(0, 100),
    staleTime: 1000 * 60 * 5,
  });

  const ambulances = Array.isArray(ambulancesResponse)
    ? ambulancesResponse
    : ambulancesResponse?.ambulancias || [];

  const ambulanciaPorMotorista = useMemo(() => {
    const mapa = {};
    ambulances.forEach((amb) => {
      if (amb.motorista_id) {
        mapa[amb.motorista_id] = amb;
      }
    });
    return mapa;
  }, [ambulances]);

  const ambulanceQueries = useQueries({
    queries: motoristas
      .filter((m) => {
        const amb = ambulanciaPorMotorista[m.id];
        return amb && amb.id;
      })
      .map((motorista) => {
        const amb = ambulanciaPorMotorista[motorista.id];
        return {
          queryKey: ["ambulance", amb.id],
          queryFn: () => getAmbulanceById(amb.id),
          enabled: !!amb?.id,
          staleTime: 1000 * 60 * 5,
        };
      }),
  });

  const enrichedDrivers = useMemo(() => {
    const ambulanceMap = {};
    let queryIndex = 0;
    motoristas.forEach((motorista) => {
      const amb = ambulanciaPorMotorista[motorista.id];
      if (amb && amb.id) {
        const query = ambulanceQueries[queryIndex];
        if (query?.data) {
          ambulanceMap[motorista.id] = query.data;
        }
        queryIndex++;
      }
    });

    return motoristas.map((motorista) => {
      const amb = ambulanciaPorMotorista[motorista.id];
      const ambulancia = ambulanceMap[motorista.id] || null;

      const driverInfo = {
        id_ambulancia: amb?.id || null,
        em_viagem: motorista.em_viagem || false,
        cnh: motorista.cnh || null,
        vencimento: motorista.vencimento || null,
      };

      return {
        ...motorista,
        driverInfo,
        ambulancia,
      };
    });
  }, [motoristas, ambulanciaPorMotorista, ambulanceQueries]);

  const isLoading = ambulanceQueries.some((q) => q.isLoading);

  return {
    enrichedDrivers,
    isLoading,
  };
}
