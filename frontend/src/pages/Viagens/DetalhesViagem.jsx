import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, User, Ambulance, Phone, FileUser, AlertTriangle } from "lucide-react";
import { getTravelStatusLabel, getTravelStatusColors } from "@/lib/travel-status";
import { formatarDataHora } from "@/lib/date-utils";
import { MapaDetalhes } from "./DetalhesViagem/MapaDetalhes";
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
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { deleteTravel } from "@/services/travelService";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function DetalhesViagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  // Quando tiver GET /travel/{id}, substituir por
  // const { data: viagem, isLoading } = useQuery({
  //   queryKey: ['travel', id],
  //   queryFn: () => getTravelById(id)
  // });

  const { data: users = [], isLoading: loadingDrivers } = useQuery({
    queryKey: ['users'],
    queryFn: () => authService.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const motoristas = users.filter(u => u.cargo === 1);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTravel(id),
    onSuccess: () => {
      toast.success('Viagem cancelada', {
        description: 'A viagem foi cancelada com sucesso.',
        duration: 3000,
      });
      queryClient.invalidateQueries(['travels']);
      navigate('/agendamentos');
    },
    onError: (err) => {
      console.error("Erro ao cancelar viagem:", err);
      const erros = err.response?.data?.Erros || [];
      const mensagemErro = erros.length > 0
        ? Object.values(erros[0])[0]
        : "Erro ao cancelar viagem. Tente novamente.";
      toast.error('Erro ao cancelar viagem', {
        description: mensagemErro,
        duration: 5000,
      });
    },
  });

  // quando implementada endpoint POST /manager/travel/{travel}
  const assignDriverMutation = useMutation({
    mutationFn: async (driverId) => {
      // return API.post(`/manager/travel/{travel}`;
      throw new Error("Endpoint ainda não implementado no backend");
    },
    onSuccess: () => {
      toast.success('Motorista atribuído', {
        description: 'O motorista foi atribuído à viagem com sucesso.',
        duration: 3000,
      });
      queryClient.invalidateQueries(['travels']);
      queryClient.invalidateQueries(['travel', id]);
      setIsAssignDialogOpen(false);
      setSelectedDriver("");
    },
    onError: (err) => {
      console.error("Erro ao atribuir motorista:", err);
      toast.error('Erro ao atribuir motorista', {
        description: err.message || "Não foi possível atribuir o motorista. Tente novamente.",
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
      toast.error('Selecione um motorista', {
        description: 'É necessário selecionar um motorista antes de continuar.',
        duration: 3000,
      });
      return;
    }
    assignDriverMutation.mutate(selectedDriver);
  };

  const viagemMock = {
    id: id,
    realizado: 0,
    inicio: new Date().toISOString(),
    fim: null,
    local_inicio: "Joaquim Augusto Ribeiro de Souza, s/nº - Parque Santa Felicia Jardim, São Carlos - SP",
    local_fim: "Santa Casa de São Carlos, 573, Rua Paulino Botelho de Abreu Sampaio, Jardim Paraíso",
    criado_em: new Date().toISOString(),
    paciente: {
      nome: "João Silva",
      cpf: "123.456.789-00"
    },
    motorista: null,
    ambulancia: null
  };

  const statusColors = getTravelStatusColors(viagemMock.realizado);
  const statusLabel = getTravelStatusLabel(viagemMock.realizado);

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalhes da Viagem</h1>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>
        <Badge className={`${statusColors.className} text-base px-4 py-2`}>
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informações da Viagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Origem</p>
              <p className="font-medium">{viagemMock.local_inicio}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Destino</p>
              <p className="font-medium">{viagemMock.local_fim}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data/Hora Início</p>
                <p className="font-medium">{formatarDataHora(viagemMock.inicio)}</p>
              </div>
              {viagemMock.fim && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data/Hora Fim</p>
                  <p className="font-medium">{formatarDataHora(viagemMock.fim)}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Solicitado em</p>
              <p className="font-medium">{formatarDataHora(viagemMock.criado_em)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nome</p>
              <p className="font-medium">{viagemMock.paciente.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">CPF</p>
              <div className="flex items-center gap-2">
                <FileUser className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{viagemMock.paciente.cpf}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Motorista
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viagemMock.motorista ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium">{viagemMock.motorista.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{viagemMock.motorista.telefone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Motorista não atribuído</p>
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Atribuir Motorista
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Atribuir Motorista</DialogTitle>
                      <DialogDescription>
                        Selecione um motorista disponível para atribuir a esta viagem.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="motorista">Motorista</Label>
                        {loadingDrivers ? (
                          <p className="text-sm text-muted-foreground">Carregando motoristas...</p>
                        ) : motoristas.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhum motorista disponível</p>
                        ) : (
                          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                            <SelectTrigger id="motorista">
                              <SelectValue placeholder="Selecione um motorista" />
                            </SelectTrigger>
                            <SelectContent>
                              {motoristas.map((motorista) => (
                                <SelectItem key={motorista.id} value={motorista.id}>
                                  {motorista.nome} - {motorista.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      {selectedDriver && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <p className="font-medium mb-1">Nota:</p>
                          <p className="text-muted-foreground">
                            A ambulância será atribuída automaticamente com base no motorista selecionado.
                          </p>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAssignDialogOpen(false);
                          setSelectedDriver("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAtribuirMotorista}
                        disabled={!selectedDriver || assignDriverMutation.isPending}
                      >
                        {assignDriverMutation.isPending ? "Atribuindo..." : "Atribuir"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5" />
              Ambulância
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viagemMock.ambulancia ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Placa</p>
                  <p className="font-medium">{viagemMock.ambulancia.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Modelo</p>
                  <p className="font-medium">{viagemMock.ambulancia.modelo}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {viagemMock.motorista
                    ? "Ambulância será atribuída automaticamente"
                    : "Aguardando atribuição de motorista"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MapaDetalhes
        localInicio={viagemMock.local_inicio}
        localFim={viagemMock.local_fim}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled>Editar Viagem</Button>

            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Cancelar Viagem
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Cancelar Viagem
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar esta viagem? Esta ação não pode ser desfeita.
                    {viagemMock.motorista && (
                      <span className="block mt-2 text-sm font-medium">
                        O motorista atribuído será notificado sobre o cancelamento.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelarViagem}
                    disabled={deleteMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending ? "Cancelando..." : "Confirmar Cancelamento"}
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
