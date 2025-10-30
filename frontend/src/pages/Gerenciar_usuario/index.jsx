import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";
import authService from "@/services/authService";
import { toast } from "sonner";
import { formatarData } from "@/lib/date-utils";
import { TableSkeleton } from "@/components/ui/table-skeleton";

function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await authService.getAllUsers();
      const dados = Array.isArray(response) ? response : response.data || [];
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      toast.error("Erro ao carregar usuários", {
        description:
          "Não foi possível carregar a lista de usuários. Tente novamente.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (cargo) => {
    const colors = {
      0: "bg-blue-500 hover:bg-blue-600",
      1: "bg-green-500 hover:bg-green-600",
      2: "bg-purple-500 hover:bg-purple-600",
    };
    return colors[cargo] || "bg-gray-500";
  };

  const handleVerDetalhes = (usuario) => {
    navigate(`/usuarios/detalhes/${usuario.id}`);
  };

  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => <div className="font-medium">{row.original.nome}</div>,
      enableColumnFilter: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.email}</div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "nascimento",
      header: "Data de Nascimento",
      cell: ({ row }) => <div>{formatarData(row.original.nascimento)}</div>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "cargo",
      header: "Cargo",
      cell: ({ row }) => {
        const cargo = row.original.cargo;
        return (
          <Badge className={getRoleBadgeColor(cargo)}>
            {ROLE_LABELS[cargo] || "Desconhecido"}
          </Badge>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const cargoLabel = ROLE_LABELS[row.original.cargo] || "";
        return cargoLabel.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVerDetalhes(row.original)}
        >
          <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
          Ver Detalhes
        </Button>
      ),
      enableColumnFilter: false,
    },
  ];

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            👥 Gerenciamento de Usuários
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      {loading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={usuarios}
              filterColumn="nome"
              filterPlaceholder="Buscar por nome..."
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default Usuarios;
