import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Shield,
  AlertTriangle,
  Star,
  Package,
  MapPin,
  CheckCircle,
  Ambulance,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDriverAmbulance,
  updateAmbulance,
} from "@/services/ambulanceService";
import {
  getAmbulanceTypeLabel,
  getAmbulanceStatusLabel,
  getAmbulanceStatusColors,
  AmbulanceStatus,
} from "@/lib/ambulance";
import { TextAnimate } from "@/components/ui/text-animate";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DriverAmbulanciasView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const {
    data: ambulanciaAtribuida,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ambulance", "driver", user?.id],
    queryFn: getDriverAmbulance,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const updateStatusToMaintenanceMutation = useMutation({
    mutationFn: async () => {
      if (!ambulanciaAtribuida?.id) {
        throw new Error("ID da ambulância não encontrado");
      }
      return await updateAmbulance(ambulanciaAtribuida.id, {
        status: AmbulanceStatus.MAINTENANCE,
        tipo: ambulanciaAtribuida.tipo,
      });
    },
    onSuccess: () => {
      toast.success("Status atualizado", {
        description: "A ambulância foi marcada como em manutenção.",
        duration: 3000,
      });
      queryClient.invalidateQueries(["ambulance", "driver", user?.id]);
      setIsMaintenanceDialogOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível atualizar o status da ambulância. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const updateStatusToActiveMutation = useMutation({
    mutationFn: async () => {
      if (!ambulanciaAtribuida?.id) {
        throw new Error("ID da ambulância não encontrado");
      }
      return await updateAmbulance(ambulanciaAtribuida.id, {
        status: AmbulanceStatus.ACTIVE,
        tipo: ambulanciaAtribuida.tipo,
      });
    },
    onSuccess: () => {
      toast.success("Status atualizado", {
        description: "A ambulância foi marcada como disponível.",
        duration: 3000,
      });
      queryClient.invalidateQueries(["ambulance", "driver", user?.id]);
      setIsMaintenanceDialogOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível atualizar o status da ambulância. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const handleSetMaintenance = () => {
    updateStatusToMaintenanceMutation.mutate();
  };

  const handleRemoveMaintenance = () => {
    updateStatusToActiveMutation.mutate();
  };

  const isInMaintenance =
    ambulanciaAtribuida?.status === AmbulanceStatus.MAINTENANCE;

  return (
    <main className="space-y-6 lg:container lg:mx-auto">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Ambulance className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            delay={0.15}
            accessible={false}
            className="text-xl md:text-2xl font-bold text-foreground"
          >
            Minha Ambulância
          </TextAnimate>
        </div>
        <p className="text-muted-foreground">
          Visualize as informações da ambulância atribuída a você
        </p>
      </header>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Carregando...</h3>
            <p className="text-muted-foreground">
              Buscando informações da sua ambulância
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-block p-4 bg-destructive/10 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar as informações da ambulância
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && ambulanciaAtribuida && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      className={`${
                        getAmbulanceStatusColors(ambulanciaAtribuida.status)
                          .className
                      } text-sm px-3 py-1`}
                    >
                      {getAmbulanceStatusLabel(ambulanciaAtribuida.status)}
                    </Badge>
                    {!isInMaintenance ? (
                      <AlertDialog
                        open={isMaintenanceDialogOpen}
                        onOpenChange={setIsMaintenanceDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs"
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            Marcar em Manutenção
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-xl text-foreground">
                              <Wrench className="h-6 w-6 text-orange-500" />
                              Marcar Ambulância em Manutenção
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-3 pt-2">
                                <p>
                                  Tem certeza que deseja marcar esta ambulância
                                  como em manutenção?
                                </p>
                                <div className="rounded-lg bg-orange-500/20 border border-orange-500/30 p-3">
                                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                    ⚠️ A ambulância ficará indisponível para
                                    novas viagens até que o status seja alterado
                                    novamente.
                                  </p>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleSetMaintenance}
                              disabled={
                                updateStatusToMaintenanceMutation.isPending
                              }
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              {updateStatusToMaintenanceMutation.isPending
                                ? "Atualizando..."
                                : "Confirmar Manutenção"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog
                        open={isMaintenanceDialogOpen}
                        onOpenChange={setIsMaintenanceDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Remover de Manutenção
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-xl text-foreground">
                              <CheckCircle className="h-6 w-6 text-green-500" />
                              Remover Ambulância de Manutenção
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-3 pt-2">
                                <p>
                                  Tem certeza que deseja remover esta ambulância
                                  da manutenção e torná-la disponível novamente?
                                </p>
                                <div className="rounded-lg bg-green-500/20 border border-green-500/30 p-3">
                                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    ✓ A ambulância ficará disponível para novas
                                    viagens após a confirmação.
                                  </p>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRemoveMaintenance}
                              disabled={updateStatusToActiveMutation.isPending}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {updateStatusToActiveMutation.isPending
                                ? "Atualizando..."
                                : "Confirmar Disponibilidade"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <div className="p-3 md:p-4 bg-primary/10 rounded-xl">
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Tipo
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {getAmbulanceTypeLabel(ambulanciaAtribuida.tipo)}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-primary/10 rounded-xl">
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Placa
                    </p>
                    <p className="text-xl md:text-2xl font-mono font-bold text-foreground tracking-wider">
                      {ambulanciaAtribuida.placa}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-primary/10 rounded-xl">
                    <Star className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Equipamentos a Bordo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ambulanciaAtribuida.equipamentos &&
              ambulanciaAtribuida.equipamentos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ambulanciaAtribuida.equipamentos.map(
                    (equipamento, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-semibold text-foreground text-base leading-tight">
                              {equipamento.equipamento || equipamento.nome}
                            </h4>
                            {equipamento.descricao && (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {equipamento.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-muted rounded-full mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum equipamento
                  </h3>
                  <p className="text-muted-foreground">
                    Esta ambulância ainda não possui equipamentos cadastrados
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!isLoading && !error && !ambulanciaAtribuida && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-block p-4 bg-muted rounded-full mb-6">
              <Truck className="h-12 w-12 text-muted-foreground" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Nenhuma ambulância atribuída
            </h3>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Você ainda não possui uma ambulância designada. Entre em contato
              com o administrador do sistema para receber sua unidade.
            </p>

            <Button variant="outline" onClick={() => window.location.reload()}>
              <MapPin className="h-4 w-4 mr-2" />
              Verificar novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
