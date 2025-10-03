import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTravels, deleteTravel } from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Agendamentos() {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viagemExcluir, setViagemExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTravels(100, 0);

      const dados = Array.isArray(response) ? response : (response.data || []);
      setViagens(dados);
    } catch (err) {
      console.error("Erro ao carregar viagens:", err);
      setError("Erro ao carregar seus agendamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!viagemExcluir) return;

    setExcluindo(true);
    try {
      await deleteTravel(viagemExcluir.id);
      setViagens(viagens.filter((v) => v.id !== viagemExcluir.id));
      setViagemExcluir(null);
    } catch (err) {
      console.error("Erro ao excluir viagem:", err);
      setError("Erro ao excluir viagem. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  };

  const formatarDataHora = (dataISO) => {
    if (!dataISO) return "Data não disponível";
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusViagem = (viagem) => {
    const agora = new Date();
    const inicio = new Date(viagem.inicio);
    const fim = new Date(viagem.fim);

    if (agora < inicio) return "pendente";
    if (agora >= inicio && agora <= fim) return "em_andamento";
    return "concluida";
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: { label: "Pendente", className: "bg-yellow-500 hover:bg-yellow-600" },
      em_andamento: { label: "Em andamento", className: "bg-blue-500 hover:bg-blue-600" },
      concluida: { label: "Concluída", className: "bg-green-500 hover:bg-green-600" },
    };
    return badges[status] || badges.pendente;
  };

  const columns = [
    {
      accessorKey: "inicio",
      header: "Data e Hora",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{formatarDataHora(row.original.inicio)}</span>
        </div>
      ),
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
      accessorKey: "duracao",
      header: "Duração",
      cell: ({ row }) => {
        const duracao = Math.round(
          (new Date(row.original.fim) - new Date(row.original.inicio)) / 60000
        );
        return <span>{duracao} min</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = getStatusViagem(row.original);
        const badgeInfo = getStatusBadge(status);
        return <Badge className={badgeInfo.className}>{badgeInfo.label}</Badge>;
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
            onClick={() => setViagemExcluir(row.original)}
            disabled={status === "em_andamento"}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        );
      },
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
            📋 Meus Agendamentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas viagens agendadas
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={viagens}
              filterColumn="local_inicio"
              filterPlaceholder="Buscar por origem..."
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viagemExcluir} onOpenChange={() => setViagemExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento?
            </DialogDescription>
          </DialogHeader>

          {viagemExcluir && (
            <div className="space-y-2 py-4">
              <p className="text-sm text-foreground">
                <strong>Data:</strong> {formatarDataHora(viagemExcluir.inicio)}
              </p>
              <p className="text-sm text-foreground">
                <strong>Origem:</strong> {viagemExcluir.local_inicio}
              </p>
              <p className="text-sm text-foreground">
                <strong>Destino:</strong> {viagemExcluir.local_fim}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViagemExcluir(null)}
              disabled={excluindo}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluir}
              disabled={excluindo}
            >
              {excluindo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Agendamentos;
