import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getTravels } from "@/services/travelService";
import { formatarDataHora } from "@/lib/date-utils";

export function useUserDashboard() {
  const {
    data: viagens = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['travels', 'user'],
    queryFn: () => getTravels(100, 0),
    staleTime: 1000 * 60 * 2,
  });

  const dashboardData = useMemo(() => {
    const stats = {
      pendentes: viagens.filter(v => v.status === 'Pendente').length,
      concluidas: viagens.filter(v => v.status === 'Finalizada').length,
      total: viagens.length
    };

    const proximasViagens = viagens
      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
      .slice(0, 3) 
      .map(v => ({
        id: v.id,
        dataHoraCompleta: formatarDataHora(v.inicio),
        dataISO: v.inicio,
        origem: v.local_inicio,
        destino: v.local_fim,
        status: v.status ? v.status.toLowerCase() : 'pendente',
        paciente: v.nome_paciente
      }));

    return { stats, proximasViagens };
  }, [viagens]);

  return {
    dashboardData,
    loading,
    error
  };
}
