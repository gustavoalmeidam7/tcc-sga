import { useState, useEffect, useCallback } from "react";
import {
  getDriverAmbulance,
  updateAmbulance as updateAmbulanceService,
} from "../services/ambulance";

export const useAmbulance = () => {
  const [ambulance, setAmbulance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAmbulance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDriverAmbulance();
      setAmbulance(data);
    } catch (err) {
      console.error("Erro ao buscar ambulância:", err);
      setError(err.message || "Erro ao carregar informações da ambulância");
      setAmbulance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmbulance();
  }, [fetchAmbulance]);

  const updateAmbulanceStatus = useCallback(async (ambulanceId, status, tipo) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await updateAmbulanceService(ambulanceId, {
        status,
        tipo,
      });
      setAmbulance(updatedData);
      return updatedData;
    } catch (err) {
      console.error("Erro ao atualizar ambulância:", err);
      setError(err.message || "Erro ao atualizar status da ambulância");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ambulance,
    loading,
    error,
    fetchAmbulance,
    updateAmbulanceStatus,
  };
};







