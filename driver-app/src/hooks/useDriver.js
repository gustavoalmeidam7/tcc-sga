import { useState, useEffect, useCallback } from "react";
import {
  getDriverInfo as fetchDriverInfoRequest,
  updateDriver as updateDriverRequest,
} from "../services/driver";

export const useDriver = () => {
  const [driverInfo, setDriverInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriverInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDriverInfoRequest();
      setDriverInfo(data);
    } catch (err) {
      console.error("Erro ao buscar informações do motorista:", err);
      setError(err.message || "Erro ao carregar informações do motorista");
      setDriverInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDriverInfo();
  }, [fetchDriverInfo]);

  const updateDriver = useCallback(async (driverFields) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await updateDriverRequest(driverFields);
      setDriverInfo(updatedData);
      return updatedData;
    } catch (err) {
      console.error("Erro ao atualizar motorista:", err);
      setError(err.message || "Erro ao atualizar informações");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    driverInfo,
    loading,
    error,
    fetchDriverInfo,
    updateDriver,
  };
};
