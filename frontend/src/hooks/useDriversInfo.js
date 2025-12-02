import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAmbulances, getAmbulanceById } from "@/services/ambulanceService";
import { getDriverById } from "@/services/driverService";

export function useDriversInfo(motoristas) {
  const { data: ambulancesResponse, isLoading: isLoadingAmbulances } = useQuery(
    {
      queryKey: ["ambulances"],
      queryFn: () => getAmbulances(0, 100),
      staleTime: 1000 * 60 * 5,
      retry: 2,
    }
  );

  const ambulances = useMemo(() => {
    if (Array.isArray(ambulancesResponse)) {
      return ambulancesResponse;
    }
    return ambulancesResponse?.ambulancias || [];
  }, [ambulancesResponse]);

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
      retry: 1,
    })),
  });

  const motoristasComAmbulancia = useMemo(() => {
    return motoristas.filter((m) => {
      const amb = ambulanciaPorMotorista[m.id];
      return amb && amb.id;
    });
  }, [motoristas, ambulanciaPorMotorista]);

  const ambulanceQueries = useQueries({
    queries: motoristasComAmbulancia.map((motorista) => {
      const amb = ambulanciaPorMotorista[motorista.id];
      return {
        queryKey: ["ambulance", amb.id],
        queryFn: () => getAmbulanceById(amb.id),
        enabled: !!amb?.id,
        staleTime: 1000 * 60 * 5,
        retry: 1,
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
    motoristasComAmbulancia.forEach((motorista, index) => {
      const query = ambulanceQueries[index];
      if (query?.data) {
        const amb = ambulanciaPorMotorista[motorista.id];
        if (amb) {
          ambulanceMap[motorista.id] = query.data;
        }
      }
    });

    return motoristas.map((motorista) => {
      const driverInfoData = driverInfoMap[motorista.id];
      const amb = ambulanciaPorMotorista[motorista.id];

      const ambulancia =
        ambulanceMap[motorista.id] || amb || driverInfoData?.ambulancia || null;

      const driverInfo = {
        id_ambulancia: amb?.id || driverInfoData?.id_ambulancia || null,
        em_viagem: driverInfoData?.em_viagem ?? motorista.em_viagem ?? false,
        cnh: driverInfoData?.cnh || motorista.cnh || null,
        vencimento: driverInfoData?.vencimento || motorista.vencimento || null,
      };

      return {
        ...motorista,
        driverInfo,
        ambulancia,
      };
    });
  }, [
    motoristas,
    ambulanciaPorMotorista,
    driverQueries,
    ambulanceQueries,
    motoristasComAmbulancia,
  ]);

  const isLoading =
    isLoadingAmbulances ||
    driverQueries.some((q) => q.isLoading) ||
    ambulanceQueries.some((q) => q.isLoading);

  const hasError =
    driverQueries.some((q) => q.isError) ||
    ambulanceQueries.some((q) => q.isError);

  return {
    enrichedDrivers,
    isLoading,
    hasError,
  };
}
