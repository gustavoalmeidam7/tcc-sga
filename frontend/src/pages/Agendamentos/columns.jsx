import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { formatarDataHora } from "@/lib/date-utils";
import { calcularDuracao } from "./utils";
import { getTravelStatusLabel, getTravelStatusColors } from "@/lib/travel-status";

export const createColumns = (onDelete, navigate) => [
  {
    accessorKey: "inicio",
    header: "Data e Hora",
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
      <div className="max-w-[150px] truncate">{row.original._solicitante || "N/A"}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "_endereco_origem",
    header: "Origem",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.original._endereco_origem || "N/A"}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "_endereco_destino",
    header: "Destino",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.original._endereco_destino || "N/A"}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "duracao",
    header: "Duração",
    cell: ({ row }) => {
      const duracao = calcularDuracao(row.original.inicio, row.original.fim);
      return <span>{duracao} min</span>;
    },
    enableColumnFilter: false,
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
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const label = getTravelStatusLabel(row.original.realizado);
      return label.toLowerCase().includes(value.toLowerCase());
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
            onClick={() => navigate && navigate(`/viagens/detalhes/${viagem.id}`)}
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
