import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravels, deleteTravel } from "@/services/travelService";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarDataHora } from "@/lib/date-utils";
import { createColumns } from "./columns";

function Agendamentos() {
  const queryClient = useQueryClient();
  const [viagemExcluir, setViagemExcluir] = useState(null);

  const {
    data: viagens = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ['travels', 'user'],
    queryFn: () => getTravels(100, 0),
    staleTime: 1000 * 60 * 2, 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travels'] });
      setViagemExcluir(null);
    },
  });

  const handleExcluir = () => {
    if (!viagemExcluir) return;
    deleteMutation.mutate(viagemExcluir.id);
  };

  const error = queryError?.message || deleteMutation.error?.message;

  const columns = useMemo(() => createColumns(setViagemExcluir), []);

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
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluir}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
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
