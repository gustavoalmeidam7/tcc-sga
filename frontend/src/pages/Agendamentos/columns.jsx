import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { formatarDataHora } from "@/lib/date-utils";
import { getStatusViagem, getStatusBadge, calcularDuracao } from "./utils";

export const createColumns = (onDelete) => [
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
    accessorKey: "local_inicio",
    header: "Origem",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.local_inicio}>
        {row.original.local_inicio}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "local_fim",
    header: "Destino",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.local_fim}>
        {row.original.local_fim}
      </div>
    ),
    enableColumnFilter: true,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getStatusViagem(row.original);
      const badgeInfo = getStatusBadge(status);
      return <Badge className={badgeInfo.className}>{badgeInfo.label}</Badge>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const status = getStatusViagem(row.original);
      return status.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const status = getStatusViagem(row.original);
      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original)}
          disabled={status === "em_andamento"}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      );
    },
    enableColumnFilter: false,
  },
];
