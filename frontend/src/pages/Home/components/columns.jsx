import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatarDataHora } from "@/lib/date-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
} from "@/lib/travel-status";

export const createColumnsViagens = (navigate) => [
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
    meta: {
      headerText: "Data/Hora",
    },
  },
  {
    accessorKey: "_solicitante",
    header: "Solicitante",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.original._solicitante || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "_endereco_origem",
    header: "Origem",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate text-xs">
        {row.original._endereco_origem || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "_endereco_destino",
    header: "Destino",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate text-xs">
        {row.original._endereco_destino || "N/A"}
      </div>
    ),
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
            <DropdownMenuItem
              onClick={() =>
                navigate && navigate(`/viagens/detalhes/${viagem.id}`)
              }
            >
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>Finalizar viagem</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columns_viagens = createColumnsViagens();

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
    cell: ({ row }) => <div className="font-medium">{row.original.nome}</div>,
    meta: {
      headerText: "Nome",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[180px] truncate">
        {row.original.email || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.telefone || "N/A"}</div>
    ),
  },
  {
    accessorKey: "driverInfo.cnh",
    header: "CNH",
    cell: ({ row }) => (
      <div className="text-sm font-mono">
        {row.original.driverInfo?.cnh || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "driverInfo.em_viagem",
    header: "Status",
    cell: ({ row }) => {
      const emViagem = row.original.driverInfo?.em_viagem;
      const isLoading = row.original.driverInfo === undefined;

      if (isLoading) {
        return (
          <Badge variant="outline" className="text-xs">
            Carregando...
          </Badge>
        );
      }

      return emViagem ? (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
          Em Viagem
        </Badge>
      ) : (
        <Badge className="bg-green-500 hover:bg-green-600 text-xs">
          Disponível
        </Badge>
      );
    },
  },
  {
    accessorKey: "ambulancia",
    header: "Ambulância",
    cell: ({ row }) => {
      const ambulancia = row.original.ambulancia;
      return (
        <div className="text-sm font-medium">{ambulancia?.placa || "N/A"}</div>
      );
    },
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
