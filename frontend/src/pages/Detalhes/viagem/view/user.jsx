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
  FileDown,
  Phone,
  Info,
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
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { cancelTravel, getTravelById } from "@/services/travelService";
import authService from "@/services/authService";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { DetailCard } from "../components/DetailCard";
import { PatientCard } from "../components/PatientCard";
import { StatusCard } from "../components/StatusCard";
import { generateTravelReportPDF } from "@/lib/pdf-utils";
import { TravelStatus } from "@/lib/travel-status";
import { getAmbulanceById } from "@/services/ambulanceService";
import { getAmbulanceTypeLabel } from "@/lib/ambulance";

export default function UserDetalhesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const {
    data: viagem,
    isLoading: loadingViagem,
    error: viagemError,
  } = useQuery({
    queryKey: ["travel", id],
    queryFn: () => getTravelById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });

  const { data: motorista, isLoading: loadingMotorista } = useQuery({
    queryKey: ["user", viagem?.id_motorista],
    queryFn: () => authService.getUserById(viagem.id_motorista),
    enabled: !!viagem?.id_motorista,
    staleTime: 1000 * 60 * 5,
  });

  const { data: solicitanteCompleto } = useQuery({
    queryKey: ["user", viagem?.id_paciente],
    queryFn: () => authService.getUserById(viagem.id_paciente),
    enabled: !!viagem?.id_paciente,
    staleTime: 1000 * 60 * 5,
  });

  const { data: ambulancia, isLoading: loadingAmbulancia } = useQuery({
    queryKey: ["ambulance", viagem?.id_ambulancia],
    queryFn: () => getAmbulanceById(viagem.id_ambulancia),
    enabled: !!viagem?.id_ambulancia,
    staleTime: 1000 * 60 * 5,
  });

  const [enderecos, setEnderecos] = useState({ origem: null, destino: null });

  const handleEnderecosCarregados = useCallback((data) => {
    setEnderecos(data);
  }, []);

  useEffect(() => {
    if (viagem?.end_inicio && viagem?.end_fim) {
      setEnderecos({
        origem: viagem.end_inicio,
        destino: viagem.end_fim,
      });
    }
  }, [viagem?.end_inicio, viagem?.end_fim]);

  const handleExportPdf = async () => {
    if (!viagem || !enderecos.origem || !enderecos.destino) {
      toast.error("Dados incompletos", {
        description: "Aguarde o carregamento completo dos dados da viagem.",
        duration: 3000,
      });
      return;
    }

    const toastId = toast.loading("Gerando Relatório PDF...", {
      description: "Aguarde enquanto preparamos seu documento.",
      duration: 3000,
    });

    try {
      const solicitante = solicitanteCompleto || { nome: user?.nome || "Você" };
      await generateTravelReportPDF(viagem, enderecos, solicitante, motorista);
      toast.success("PDF gerado com sucesso!", {
        id: toastId,
        description: "Seu download deve começar em breve.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Falha ao gerar PDF", {
        id: toastId,
        description: "Ocorreu um erro inesperado. Tente novamente.",
        duration: 5000,
      });
    }
  };

  const cancelMutation = useMutation({
    mutationFn: () => cancelTravel(id),
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
    cancelMutation.mutate();
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

  const statusColors = viagem.cancelada
    ? { className: "bg-red-500 hover:bg-red-600" }
    : getTravelStatusColors(viagem.realizado);
  const statusLabel = viagem.cancelada
    ? "Cancelada"
    : getTravelStatusLabel(viagem.realizado);

  const isCriador = user?.id === viagem.id_paciente;
  const podeCancelar =
    isCriador &&
    !viagem.cancelada &&
    viagem.realizado !== TravelStatus.REALIZADO;

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
            Detalhes da Viagem
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-mono">{id}</p>
          </div>
        </div>
        <Button
          onClick={handleExportPdf}
          variant="outline"
          size="icon"
          className="print:hidden"
        >
          <FileDown className="h-5 w-5" />
        </Button>
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
            <PatientCard
              viagem={viagem}
              loading={loadingViagem}
              solicitante={solicitanteCompleto}
            />
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
                status={
                  loadingMotorista
                    ? "Carregando..."
                    : motorista?.nome || "Motorista atribuído"
                }
                statusType="success"
              >
                <div className="mt-3 pt-3 border-t border-green-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-semibold text-foreground">
                      {loadingMotorista
                        ? "Carregando..."
                        : motorista?.nome || "N/A"}
                    </span>
                  </div>
                  {motorista?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileUser className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{motorista.email}</span>
                    </div>
                  )}
                  {motorista?.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Telefone:</span>
                      <span className="text-foreground">
                        {motorista.telefone}
                      </span>
                    </div>
                  )}
                </div>
              </StatusCard>
            ) : (
              <StatusCard
                icon={AlertCircle}
                title={
                  viagem.cancelada
                    ? "Viagem Cancelada"
                    : "Aguardando Atribuição"
                }
                status={
                  viagem.cancelada
                    ? "Não requer motorista"
                    : "Nenhum motorista atribuído"
                }
                statusType={viagem.cancelada ? "info" : "warning"}
              >
                <p className="text-xs text-muted-foreground mt-2">
                  {viagem.cancelada
                    ? "Esta viagem foi cancelada e não requer mais atribuição de motorista."
                    : "Esta viagem ainda não possui motorista designado"}
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
                status="Veículo alocado para a viagem"
                statusType="success"
              >
                <p className="text-xs text-muted-foreground mt-2">
                  Veículo alocado para a viagem
                </p>
                <div className="mt-3 pt-3 border-t border-green-500/20 space-y-2">
                  {loadingAmbulancia ? (
                    <div className="text-sm text-muted-foreground">
                      Carregando informações da ambulância...
                    </div>
                  ) : ambulancia ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Ambulance className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="font-mono font-semibold text-foreground">
                          {ambulancia.placa || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="font-semibold text-foreground">
                          {getAmbulanceTypeLabel(ambulancia.tipo)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-foreground">
                        {viagem.id_ambulancia}
                      </span>
                    </div>
                  )}
                </div>
              </StatusCard>
            ) : (
              <StatusCard
                icon={AlertCircle}
                title={
                  viagem.cancelada
                    ? "Viagem Cancelada"
                    : viagem.id_motorista
                    ? "Aguardando Atribuição Automática"
                    : "Aguardando Motorista"
                }
                status={
                  viagem.cancelada
                    ? "Não requer ambulância"
                    : viagem.id_motorista
                    ? "Será atribuída automaticamente"
                    : "Requer motorista primeiro"
                }
                statusType={
                  viagem.cancelada
                    ? "info"
                    : viagem.id_motorista
                    ? "info"
                    : "warning"
                }
              >
                <p className="text-xs mt-2 text-muted-foreground">
                  {viagem.cancelada
                    ? "Esta viagem foi cancelada e não requer mais alocação de ambulância."
                    : viagem.id_motorista
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
            end_inicio={viagem.end_inicio}
            end_fim={viagem.end_fim}
            onEnderecosCarregados={handleEnderecosCarregados}
          />
        </CardContent>
      </Card>

      {podeCancelar && (
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
                      disabled={cancelMutation.isPending}
                      className="bg-destructive hover:bg-destructive/90"
                      style={{ color: theme === "dark" ? "white" : "black" }}
                    >
                      {cancelMutation.isPending
                        ? "Cancelando..."
                        : "Confirmar Cancelamento"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
