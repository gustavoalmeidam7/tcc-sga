import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns_viagens = [
  {
    accessorKey: "paciente",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base font-bold p-0 h-9"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "destino",
    header: "Destino",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variant = {
        Aguardando: "bg-chart-4/20 text-chart-4 font-semibold",
      }[status] ?? "bg-muted/20 text-muted-foreground";

      return <div className={`px-2 py-1 rounded-full text-xs text-center w-24 ${variant}`}>{status}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const viagem = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(viagem.id)}
            >
              Copiar ID da Viagem
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Finalizar viagem</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columns_motoristas = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-base font-bold p-0 h-9"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status");
        const variant = {
          Ativo: "bg-primary/20 text-primary font-semibold",
          Inativo: "bg-destructive/20 text-destructive font-semibold",
        }[status] ?? "bg-muted/20 text-muted-foreground";
  
        return <div className={`px-2 py-1 rounded-full text-xs text-center w-20 ${variant}`}>{status}</div>;
      },
  },
  {
    accessorKey: "ambulancia",
    header: "Ambulância",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const motorista = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(motorista.id)}
            >
              Copiar ID do Motorista
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Atribuir viagem</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
