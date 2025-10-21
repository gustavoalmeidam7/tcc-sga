import { ArrowUpDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarDataHora } from "@/lib/date-utils";
import { getTravelStatusLabel, getTravelStatusColors } from "@/lib/travel-status";
import { useNavigate } from "react-router-dom";

export const createColumnsHistorico = () => [
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
    cell: ({ row }) => formatarDataHora(row.original.inicio),
  },
  {
    accessorKey: "local_inicio",
    header: "Origem",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.local_inicio}>
        {row.original.local_inicio}
      </div>
    ),
  },
  {
    accessorKey: "local_fim",
    header: "Destino",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.local_fim}>
        {row.original.local_fim}
      </div>
    ),
  },
  {
    accessorKey: "fim",
    header: "Concluída em",
    cell: ({ row }) => {
      return row.original.fim
        ? formatarDataHora(row.original.fim)
        : <span className="text-muted-foreground text-sm">-</span>;
    },
  },
  {
    accessorKey: "realizado",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.realizado;
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
      const navigate = useNavigate();

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/viagens/detalhes/${viagem.id}`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      );
    },
  },
];
