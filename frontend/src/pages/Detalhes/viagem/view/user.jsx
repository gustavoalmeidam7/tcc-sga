import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  User,
  Ambulance,
  FileUser,
  AlertTriangle,
  Hash,
  Calendar,
  Navigation,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
} from "@/lib/travel-status";
import { formatarDataHora } from "@/lib/date-utils";
import { MapaDetalhes } from "../MapaDetalhes";
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
import { useState, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { deleteTravel, getTravelById } from "@/services/travelService";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { DetailCard } from "../components/DetailCard";
import { PatientCard } from "../components/PatientCard";
import { StatusCard } from "../components/StatusCard";

export default function UserDetalhesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data: viagem, isLoading: loadingViagem } = useQuery({
    queryKey: ["travel", id],
    queryFn: () => getTravelById(id),
    staleTime: 1000 * 60 * 2,
  });

  const [enderecos, setEnderecos] = useState({ origem: null, destino: null });

  const handleEnderecosCarregados = useCallback((data) => {
    setEnderecos(data);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTravel(id),
    onSuccess: () => {
      toast.success("Viagem cancelada", {
        description: "A viagem foi cancelada com sucesso.",
        duration: 3000,
      });
      queryClient.invalidateQueries(["travels"]);
      navigate("/agendamentos");
    },
    onError: (err) => {
      console.error("Erro ao cancelar viagem:", err);
      const erros = err.response?.data?.Erros || [];
      const mensagemErro =
        erros.length > 0
          ? Object.values(erros[0])[0]
          : "Erro ao cancelar viagem. Tente novamente.";
      toast.error("Erro ao cancelar viagem", {
        description: mensagemErro,
        duration: 5000,
      });
    },
  });

  const handleCancelarViagem = () => {
    deleteMutation.mutate();
    setIsCancelDialogOpen(false);
  };

  if (loadingViagem) {
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

  if (!viagem) {
    return (
      <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Viagem não encontrada</h1>
          </div>
        </div>
      </main>
    );
  }

  const statusColors = getTravelStatusColors(viagem.realizado);
  const statusLabel = getTravelStatusLabel(viagem.realizado);

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Detalhes da Viagem
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-mono">{id}</p>
          </div>
        </div>
        <Badge className={`${statusColors.className} text-base px-4 py-2`}>
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DetailCard
          icon={Navigation}
          label="Ponto de Origem"
          value={enderecos.origem || "Carregando endereço..."}
          description="Local de partida da viagem"
        />

        <DetailCard
          icon={MapPin}
          label="Ponto de Destino"
          value={enderecos.destino || "Carregando endereço..."}
          description="Local de chegada da viagem"
        />

        <DetailCard
          icon={Calendar}
          label="Data e Horário"
          value={formatarDataHora(viagem.inicio)}
          description={
            viagem.fim
              ? `Finalização prevista em ${formatarDataHora(viagem.fim)}`
              : "Viagem em andamento"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileUser className="h-5 w-5" />
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientCard viagem={viagem} loading={loadingViagem} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Motorista Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viagem.id_motorista ? (
              <StatusCard
                icon={CheckCircle2}
                title="Motorista Atribuído"
                status={`ID: ${viagem.id_motorista}`}
                statusType="success"
              >
                <p className="text-xs text-muted-foreground mt-2">
                  Viagem possui motorista designado
                </p>
              </StatusCard>
            ) : (
              <StatusCard
                icon={AlertCircle}
                title="Aguardando Atribuição"
                status="Nenhum motorista atribuído"
                statusType="warning"
              >
                <p className="text-xs text-muted-foreground mt-2">
                  Esta viagem ainda não possui motorista designado
                </p>
              </StatusCard>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ambulance className="h-5 w-5" />
              Ambulância
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viagem.id_ambulancia ? (
              <StatusCard
                icon={CheckCircle2}
                title="Ambulância Atribuída"
                status={`ID: ${viagem.id_ambulancia}`}
                statusType="success"
              >
                <p className="text-xs text-muted-foreground mt-2">
                  Veículo alocado para a viagem
                </p>
              </StatusCard>
            ) : (
              <StatusCard
                icon={AlertCircle}
                title={
                  viagem.id_motorista
                    ? "Aguardando Atribuição Automática"
                    : "Aguardando Motorista"
                }
                status={
                  viagem.id_motorista
                    ? "Será atribuída automaticamente"
                    : "Requer motorista primeiro"
                }
                statusType={viagem.id_motorista ? "info" : "warning"}
              >
                <p className="text-xs mt-2 text-muted-foreground">
                  {viagem.id_motorista
                    ? "A ambulância será vinculada automaticamente após a confirmação do motorista."
                    : "Atribua um motorista para que a ambulância seja alocada."}
                </p>
              </StatusCard>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Visualização do Trajeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapaDetalhes
            lat_inicio={viagem.lat_inicio}
            long_inicio={viagem.long_inicio}
            lat_fim={viagem.lat_fim}
            long_fim={viagem.long_fim}
            onEnderecosCarregados={handleEnderecosCarregados}
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-1">
                Zona de Perigo
              </h3>
              <p className="text-sm text-muted-foreground">
                Ações irreversíveis que afetam esta viagem
              </p>
            </div>
            <AlertDialog
              open={isCancelDialogOpen}
              onOpenChange={setIsCancelDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Cancelar Viagem
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-xl text-foreground">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    Confirmar Cancelamento
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3 pt-2">
                      <p>
                        Tem certeza que deseja cancelar esta viagem? Esta ação
                        não pode ser desfeita.
                      </p>
                      {viagem.id_motorista && (
                        <div className="rounded-lg bg-destructive/20 border border-destructive/30 p-3">
                          <p className="text-sm font-medium text-destructive">
                            ⚠️ O motorista atribuído será notificado
                            automaticamente sobre o cancelamento.
                          </p>
                        </div>
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelarViagem}
                    disabled={deleteMutation.isPending}
                    className="bg-destructive hover:bg-destructive/90"
                    style={{ color: theme === "dark" ? "white" : "black" }}
                  >
                    {deleteMutation.isPending
                      ? "Cancelando..."
                      : "Confirmar Cancelamento"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
