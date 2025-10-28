import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  User,
  Ambulance,
  AlertTriangle,
  Calendar,
  UserCheck,
  FileText,
  Hash,
  Navigation,
  CheckCircle2,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { deleteTravel, getTravelById } from "@/services/travelService";
import authService from "@/services/authService";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { DetailCard } from "../components/DetailCard";
import { InfoRow } from "../components/InfoRow";
import { PersonCard } from "../components/PersonCard";
import { PatientCard } from "../components/PatientCard";
import { StatusCard } from "../components/StatusCard";

export default function ManagerDetalhesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const { data: viagem, isLoading: loadingViagem } = useQuery({
    queryKey: ["travel", id],
    queryFn: () => getTravelById(id),
    staleTime: 1000 * 60 * 2,
  });

  const { data: users = [], isLoading: loadingDrivers } = useQuery({
    queryKey: ["users"],
    queryFn: () => authService.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const motoristas = users.filter((u) => u.cargo === 1);

  const { data: solicitante, isLoading: loadingSolicitante } = useQuery({
    queryKey: ["user", viagem?.id_paciente],
    queryFn: () => authService.getUserById(viagem.id_paciente),
    enabled: !!viagem?.id_paciente,
    staleTime: 1000 * 60 * 5,
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

  const assignDriverMutation = useMutation({
    mutationFn: async (driverId) => {
      throw new Error("Endpoint ainda não implementada");
    },
    onSuccess: () => {
      toast.success("Motorista atribuído", {
        description: "O motorista foi atribuído à viagem com sucesso.",
        duration: 3000,
      });
      queryClient.invalidateQueries(["travels"]);
      queryClient.invalidateQueries(["travel", id]);
      setIsAssignDialogOpen(false);
      setSelectedDriver("");
    },
    onError: (err) => {
      console.error("Erro ao atribuir motorista:", err);
      toast.error("Erro ao atribuir motorista", {
        description:
          err.message ||
          "Não foi possível atribuir o motorista. Tente novamente.",
        duration: 5000,
      });
    },
  });

  const handleCancelarViagem = () => {
    deleteMutation.mutate();
    setIsCancelDialogOpen(false);
  };

  const handleAtribuirMotorista = () => {
    if (!selectedDriver) {
      toast.error("Selecione um motorista", {
        description: "É necessário selecionar um motorista antes de continuar.",
        duration: 3000,
      });
      return;
    }
    assignDriverMutation.mutate(selectedDriver);
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
              <UserCheck className="h-5 w-5" />
              Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonCard
              person={solicitante}
              title="Responsável pela Solicitação"
              subtitle={`Solicitado em ${formatarDataHora(viagem.criado_em)}`}
              icon={UserCheck}
              loading={loadingSolicitante}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientCard viagem={viagem} loading={loadingSolicitante} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Motorista Responsável
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {viagem.id_motorista ? (
              <StatusCard
                icon={CheckCircle2}
                title="Motorista Atribuído"
                status="Viagem possui motorista"
                statusType="success"
              >
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <InfoRow
                    icon={Hash}
                    label="ID do Motorista"
                    value={viagem.id_motorista}
                  />
                </div>
              </StatusCard>
            ) : (
              <>
                <StatusCard
                  icon={AlertCircle}
                  title="Aguardando Atribuição"
                  status="Nenhum motorista atribuído"
                  statusType="warning"
                >
                  <p className="text-xs text-muted-foreground mt-2">
                    Esta viagem precisa de um motorista para ser realizada.
                  </p>
                </StatusCard>

                <Dialog
                  open={isAssignDialogOpen}
                  onOpenChange={setIsAssignDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Atribuir Motorista
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-foreground">
                        Atribuir Motorista
                      </DialogTitle>
                      <DialogDescription>
                        Selecione um motorista disponível para realizar esta
                        viagem.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="motorista"
                          className="text-sm font-semibold text-foreground"
                        >
                          Motorista
                        </Label>
                        {loadingDrivers ? (
                          <p className="text-sm text-muted-foreground">
                            Carregando motoristas...
                          </p>
                        ) : motoristas.length === 0 ? (
                          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Nenhum motorista disponível no momento
                            </p>
                          </div>
                        ) : (
                          <Select
                            value={selectedDriver}
                            onValueChange={setSelectedDriver}
                          >
                            <SelectTrigger
                              id="motorista"
                              className="h-16 min-h-16 text-sm"
                            >
                              <SelectValue placeholder="Selecione um motorista">
                                {selectedDriver &&
                                  (() => {
                                    const motorista = motoristas.find(
                                      (m) => m.id === selectedDriver
                                    );
                                    return (
                                      <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-base font-semibold text-foreground">
                                          {motorista?.nome}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          {motorista?.email}
                                        </span>
                                      </div>
                                    );
                                  })()}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {motoristas.map((motorista) => (
                                <SelectItem
                                  key={motorista.id}
                                  value={motorista.id}
                                  className="py-3"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">
                                      {motorista.nome}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {motorista.email}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      {selectedDriver && (
                        <StatusCard
                          icon={Info}
                          title="Informação Importante"
                          status="Atribuição automática de ambulância"
                          statusType="info"
                        >
                          <p className="text-xs text-muted-foreground mt-2">
                            A ambulância será automaticamente vinculada com base
                            no motorista selecionado.
                          </p>
                        </StatusCard>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAssignDialogOpen(false);
                          setSelectedDriver("");
                        }}
                        className="text-foreground"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAtribuirMotorista}
                        disabled={
                          !selectedDriver || assignDriverMutation.isPending
                        }
                      >
                        {assignDriverMutation.isPending
                          ? "Atribuindo..."
                          : "Confirmar Atribuição"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>

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
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <InfoRow
                    icon={Hash}
                    label="ID da Ambulância"
                    value={viagem.id_ambulancia}
                  />
                </div>
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
