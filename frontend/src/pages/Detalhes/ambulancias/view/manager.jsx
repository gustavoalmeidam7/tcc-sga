import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Ambulance as AmbulanceIcon,
  Settings,
  Wrench,
  Calendar,
  Hash,
  Truck,
  Package,
} from "lucide-react";
import {
  getAmbulanceStatusLabel,
  getAmbulanceTypeLabel,
  getAmbulanceStatusColors,
} from "@/lib/ambulance";
import { getAmbulanceById } from "@/services/ambulanceService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConfigureAmbulanceModal } from "@/pages/Gerenciar_ambulancias/components/modals/ConfigureAmbulanceModal";
import { useState, useEffect } from "react";

export default function ManagerDetalhesAmbulanciaView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);

  const {
    data: ambulancia,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["ambulance", id],
    queryFn: () => getAmbulanceById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (
      !loading &&
      (error?.response?.status === 404 || (!ambulancia && error))
    ) {
      toast.error("Ambulância não encontrada", {
        description: "A ambulância solicitada não foi encontrada no sistema.",
        duration: 3000,
      });
      navigate("/ambulancias");
    }
  }, [loading, error, ambulancia, navigate]);

  const getStatusBadgeColor = (status) => {
    const colors = getAmbulanceStatusColors(status);
    return colors.className;
  };

  if (loading) {
    return (
      <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </main>
    );
  }

  if (!ambulancia) {
    return (
      <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Ambulância não encontrada</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="print:hidden"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Detalhes da Ambulância
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-mono">
              {ambulancia.id}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="print:hidden"
          onClick={() => setIsConfigureModalOpen(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Badge
          className={`${getStatusBadgeColor(
            ambulancia.status
          )} text-base px-4 py-2`}
        >
          {getAmbulanceStatusLabel(ambulancia.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5" />
              Informações da Ambulância
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Placa
                </label>
                <p className="text-lg font-mono font-semibold">
                  {ambulancia.placa}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <p className="text-base">
                  {getAmbulanceTypeLabel(ambulancia.tipo)}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge className={getStatusBadgeColor(ambulancia.status)}>
                  {getAmbulanceStatusLabel(ambulancia.status)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID do Sistema
              </label>
              <p className="text-sm font-mono text-muted-foreground">
                {ambulancia.id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Status Operacional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disponibilidade</span>
                <Badge
                  variant={ambulancia.status === 1 ? "default" : "secondary"}
                  className={getStatusBadgeColor(ambulancia.status)}
                >
                  {ambulancia.status === 1
                    ? "Disponível"
                    : ambulancia.status === 0
                    ? "Em Uso"
                    : ambulancia.status === 3
                    ? "Em Manutenção"
                    : "Inativa"}
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Condição</span>
                <span
                  className={`text-sm font-medium ${
                    ambulancia.status === 3
                      ? "text-orange-600"
                      : ambulancia.status === 1
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {ambulancia.status === 3
                    ? "Manutenção"
                    : ambulancia.status === 1
                    ? "Operacional"
                    : ambulancia.status === 0
                    ? "Em Trânsito"
                    : "Inativa"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5" />
            Equipamentos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ambulancia.equipamentos &&
          Array.isArray(ambulancia.equipamentos) &&
          ambulancia.equipamentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambulancia.equipamentos.map((equipamento, index) => (
                <Card
                  key={equipamento.id || index}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {equipamento.equipamento || equipamento.nome}
                        </h4>
                        {equipamento.descricao && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {equipamento.descricao}
                          </p>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                Nenhum equipamento cadastrado
              </p>
              <p className="text-sm">
                Esta ambulância ainda não possui equipamentos registrados no
                sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigureAmbulanceModal
        open={isConfigureModalOpen}
        onOpenChange={setIsConfigureModalOpen}
        ambulance={ambulancia}
        onAmbulanceUpdated={() => {
          queryClient.invalidateQueries(["ambulance", id]);
          queryClient.invalidateQueries(["ambulances"]);
          setIsConfigureModalOpen(false);
        }}
      />
    </main>
  );
}
