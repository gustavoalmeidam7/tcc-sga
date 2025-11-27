import { useState } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAmbulances } from "@/services/ambulanceService";
import authService from "@/services/authService";
import { assignAmbulanceToDriver } from "@/services/managerService";
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
import { Button } from "@/components/ui/button";
import { User, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignDriverModal } from "@/pages/Gerenciar_ambulancias/components/modals/AssignDriverModal";
import { toast } from "sonner";

export function AmbulanciasLivresModal() {
  const queryClient = useQueryClient();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [ambulanceToAssign, setAmbulanceToAssign] = useState(null);

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

  const assignAmbulanceMutation = useMutation({
    mutationFn: ({ driverId, ambulanceId }) =>
      assignAmbulanceToDriver(driverId, ambulanceId),
    onSuccess: () => {
      queryClient.invalidateQueries(["ambulances"]);
      queryClient.invalidateQueries(["driver"]);
      toast.success("Motorista atribuído!", {
        description: "A ambulância foi atribuída ao motorista com sucesso.",
        duration: 3000,
      });
      setIsAssignModalOpen(false);
      setAmbulanceToAssign(null);
    },
    onError: (error) => {
      console.error("Erro ao atribuir motorista:", error);
      toast.error("Erro ao atribuir motorista", {
        description:
          error.response?.data?.detail ||
          error.response?.data?.mensagem ||
          "Não foi possível atribuir o motorista. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const handleAssignDriver = (ambulance) => {
    setAmbulanceToAssign(ambulance);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = (ambulanceId, driverId) => {
    assignAmbulanceMutation.mutate({ driverId, ambulanceId });
  };

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
            <TableHead className="text-foreground text-xs">Ações</TableHead>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAssignDriver(ambulancia)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Atribuir Motorista
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AssignDriverModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        ambulance={ambulanceToAssign}
        onAssigned={handleConfirmAssign}
      />
    </div>
  );
}
