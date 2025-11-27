import { useQueries } from "@tanstack/react-query";
import driverService from "@/services/driverService";

export function useDriversInfo(motoristas) {
  return {
    enrichedDrivers: motoristas.map((m) => ({
      ...m,
      driverInfo: null,
    })),
    isLoading: false,
  };
}
