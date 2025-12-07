import { ArrowUpDown, Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarDataHora } from "@/lib/date-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
  TravelStatus,
} from "@/lib/travel-status";

export const createColumnsHistorico = (navigate) => [
  {
    accessorKey: "inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base font-bold p-0 h-9"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data/Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        <span>{formatarDataHora(row.original.inicio)}</span>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "_solicitante",
    header: "Solicitante",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.original._solicitante || "N/A"}
      </div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "_endereco_origem",
    header: "Origem",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-xs">
        {row.original._endereco_origem || "N/A"}
      </div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "_endereco_destino",
    header: "Destino",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-xs">
        {row.original._endereco_destino || "N/A"}
      </div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "fim",
    header: "Concluída em",
    cell: ({ row }) => {
      return row.original.fim ? (
        formatarDataHora(row.original.fim)
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: "realizado",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.cancelada
        ? TravelStatus.CANCELADO
        : row.original.realizado;
      const label = getTravelStatusLabel(status);
      const colors = getTravelStatusColors(status);

      return <Badge className={colors.className}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const viagem = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate && navigate(`/viagens/detalhes/${viagem.id}`)
            }
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver detalhes
          </Button>
        </div>
      );
    },
    enableColumnFilter: false,
  },
];
