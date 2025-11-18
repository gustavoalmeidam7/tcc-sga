import { useState, useEffect, useCallback } from 'react';
import travelService from '../services/travel';
import { TravelStatus } from '@/src/lib/travel-status';

export const useTravels = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTravels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await travelService.getAssignedTravels(0, 50, false);
      setTravels(data || []);
    } catch (err) {
      console.error('Erro ao buscar viagens:', err);
      setError(err.message || 'Erro ao carregar viagens');
      setTravels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  const getTravelStats = useCallback(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const tomorrow = new Date(hoje);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const viagensAtribuidas = travels.filter(t => !t.cancelada).length;
    const viagensConcluidasHoje = travels.filter(t => {
      if (!t.fim || t.cancelada) return false;
      const fimDate = new Date(t.fim);
      return fimDate >= hoje && fimDate < tomorrow && t.realizado === TravelStatus.REALIZADO;
    }).length;

    const viagemEmAndamento = travels.find(t => t.realizado === TravelStatus.EM_PROGRESSO && !t.cancelada) || null;

    const viagensHoje = travels.filter(t => {
      if (t.cancelada || t.realizado === TravelStatus.REALIZADO) return false;
      const inicioDate = new Date(t.inicio);
      return inicioDate >= hoje && inicioDate < tomorrow;
    }).sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

    return {
      viagensAtribuidas,
      viagensConcluidasHoje,
      viagemEmAndamento,
      viagensHoje,
    };
  }, [travels]);

  return {
    travels,
    loading,
    error,
    fetchTravels,
    getTravelStats,
  };
};
