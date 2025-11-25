import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAmbulances, getAmbulanceById } from "@/services/ambulanceService";
import { getDriverById } from "@/services/driverService";

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

  const driverQueries = useQueries({
    queries: motoristas.map((motorista) => ({
      queryKey: ["driver", motorista.id],
      queryFn: () => getDriverById(motorista.id),
      enabled: !!motorista.id,
      staleTime: 1000 * 60 * 5,
    })),
  });

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
    const driverInfoMap = {};
    motoristas.forEach((motorista, index) => {
      const driverQuery = driverQueries[index];
      if (driverQuery?.data) {
        driverInfoMap[motorista.id] = driverQuery.data;
      }
    });

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

    return motoristas.map((motorista, index) => {
      const driverInfoData = driverInfoMap[motorista.id];
      const amb = ambulanciaPorMotorista[motorista.id];
      const ambulancia =
        ambulanceMap[motorista.id] || driverInfoData?.ambulancia || null;

      const driverInfo = {
        id_ambulancia: amb?.id || driverInfoData?.ambulancia?.id || null,
        em_viagem: driverInfoData?.em_viagem || motorista.em_viagem || false,
        cnh: motorista.cnh || null,
        vencimento: motorista.vencimento || null,
      };

      return {
        ...motorista,
        driverInfo,
        ambulancia,
      };
    });
  }, [motoristas, ambulanciaPorMotorista, ambulanceQueries, driverQueries]);

  const isLoading =
    driverQueries.some((q) => q.isLoading) ||
    ambulanceQueries.some((q) => q.isLoading);

  return {
    enrichedDrivers,
    isLoading,
  };
}
