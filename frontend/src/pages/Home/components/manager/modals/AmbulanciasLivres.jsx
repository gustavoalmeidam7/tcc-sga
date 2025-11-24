import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAmbulances } from "@/services/ambulanceService";
import authService from "@/services/authService";
import {
  getAmbulanceStatusLabel,
  getAmbulanceTypeLabel,
  getAmbulanceStatusColors,
} from "@/lib/ambulance";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AmbulanciasLivresModal() {
  const { data: ambulancesResponse, isLoading: isLoadingAmbulances } = useQuery(
    {
      queryKey: ["ambulances"],
      queryFn: () => getAmbulances(0, 100),
      staleTime: 1000 * 60 * 5,
    }
  );

  const ambulances = Array.isArray(ambulancesResponse)
    ? ambulancesResponse
    : ambulancesResponse?.ambulancias || [];

  const motoristaQueries = useQueries({
    queries: ambulances
      .filter((amb) => amb.motorista_id)
      .map((ambulancia) => ({
        queryKey: ["user", ambulancia.motorista_id],
        queryFn: () => authService.getUserById(ambulancia.motorista_id),
        enabled: !!ambulancia.motorista_id,
        staleTime: 1000 * 60 * 5,
      })),
  });

  const motoristaPorId = useMemo(() => {
    const mapa = {};
    const ambulanciasComMotorista = ambulances.filter(
      (amb) => amb.motorista_id
    );
    motoristaQueries.forEach((query, index) => {
      const ambulancia = ambulanciasComMotorista[index];
      if (ambulancia && query.data) {
        mapa[ambulancia.motorista_id] = query.data.nome;
      }
    });
    return mapa;
  }, [ambulances, motoristaQueries]);

  const isLoading =
    isLoadingAmbulances || motoristaQueries.some((q) => q.isLoading);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (ambulances.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma ambulância cadastrada.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-foreground text-xs">Placa</TableHead>
            <TableHead className="text-foreground text-xs">Tipo</TableHead>
            <TableHead className="text-foreground text-xs">Status</TableHead>
            <TableHead className="text-foreground text-xs">Motorista</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambulances.map((ambulancia) => {
            const statusColors = getAmbulanceStatusColors(ambulancia.status);
            const motoristaNome =
              motoristaPorId[ambulancia.motorista_id] || "-";
            return (
              <TableRow key={ambulancia.id}>
                <TableCell className="text-foreground font-medium text-sm">
                  {ambulancia.placa}
                </TableCell>
                <TableCell className="text-foreground text-sm">
                  {getAmbulanceTypeLabel(ambulancia.tipo)}
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors.className} text-xs`}>
                    {getAmbulanceStatusLabel(ambulancia.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-sm">
                  {motoristaNome}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
