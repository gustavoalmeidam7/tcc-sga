import { useMemo, memo, useState, useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { TextAnimate } from "@/components/ui/text-animate";
import {
  Truck,
  Clock,
  MapPin,
  CheckCircle,
  Navigation,
  Calendar,
  Eye,
  CheckCheck,
  Navigation2,
  Map as MapIcon,
} from "lucide-react";
import { getDriverInfo, getDriverTravels } from "@/services/driverService";
import { formatarHora } from "@/lib/date-utils";
import { formatarEndereco } from "@/lib/format-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
  TravelStatus,
} from "@/lib/travel-status";
import { useNavigate } from "react-router-dom";
import { fetchReverseGeocode } from "@/hooks/useReverseGeocode";
import { StatsCardSkeleton } from "@/components/ui/stats-skeleton";
import { startTravel, endTravel } from "@/services/travelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@/components/ui/alert-dialog";
import { useActiveTravel } from "@/context/ActiveTravelContext";
import {
  validateTravelAcceptance,
  separateTravelsByDate,
} from "@/lib/validations/travel-validations";

function DriverView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    activeTravelId,
    setActiveTravel,
    clearActiveTravel,
    hasActiveTravel,
  } = useActiveTravel();
  const [isEndTravelDialogOpen, setIsEndTravelDialogOpen] = useState(false);
  const [travelToEnd, setTravelToEnd] = useState(null);
  const [isNavigationDialogOpen, setIsNavigationDialogOpen] = useState(false);
  const [travelToNavigate, setTravelToNavigate] = useState(null);

  const { data: driverInfo, isLoading: isLoadingDriver } = useQuery({
    queryKey: ["driver", "info", user?.id],
    queryFn: getDriverInfo,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: travelsResponse,
    isLoading: isLoadingTravels,
    refetch: refetchTravels,
  } = useQuery({
    queryKey: ["driver", "travels", user?.id],
    queryFn: getDriverTravels,
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const travels = useMemo(() => {
    if (Array.isArray(travelsResponse)) {
      return travelsResponse;
    }
    return travelsResponse?.viagens || [];
  }, [travelsResponse]);

  const uniqueCoordinates = useMemo(() => {
    if (travels.length === 0) return [];

    const coordsMap = new Map();
    travels.forEach((v) => {
      if (v.lat_inicio && v.long_inicio) {
        const key = `${v.lat_inicio.toFixed(5)},${v.long_inicio.toFixed(5)}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: v.lat_inicio, long: v.long_inicio });
        }
      }
      if (v.lat_fim && v.long_fim) {
        const key = `${v.lat_fim.toFixed(5)},${v.long_fim.toFixed(5)}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: v.lat_fim, long: v.long_fim });
        }
      }
    });
    return Array.from(coordsMap.values());
  }, [travels]);

  const geocodeQueries = useQueries({
    queries: uniqueCoordinates.map((coord) => ({
      queryKey: ["geocode", coord.lat, coord.long],
      queryFn: async ({ queryKey, signal }) => {
        const [_key, lat, lon] = queryKey;
        return await fetchReverseGeocode({
          queryKey: [_key, lat, lon],
          signal,
        });
      },
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24 * 7,
    })),
  });

  const geocodeMap = useMemo(() => {
    const map = new Map();
    uniqueCoordinates.forEach((coord, index) => {
      const key = `${coord.lat.toFixed(5)},${coord.long.toFixed(5)}`;
      map.set(key, geocodeQueries[index]?.data);
    });
    return map;
  }, [uniqueCoordinates, geocodeQueries]);

  const viagensEnriquecidas = useMemo(() => {
    if (!travels.length) return [];

    return travels.map((viagem) => {
      let enderecoInicio = viagem.end_inicio;
      let enderecoFim = viagem.end_fim;

      if (!enderecoInicio) {
        enderecoInicio = geocodeMap.get(
          `${viagem.lat_inicio.toFixed(5)},${viagem.long_inicio.toFixed(5)}`
        );
      }

      if (!enderecoFim) {
        enderecoFim = geocodeMap.get(
          `${viagem.lat_fim.toFixed(5)},${viagem.long_fim.toFixed(5)}`
        );
      }

      return {
        ...viagem,
        local_inicio: enderecoInicio
          ? formatarEndereco(enderecoInicio)
          : "Carregando...",
        local_fim: enderecoFim
          ? formatarEndereco(enderecoFim)
          : "Carregando...",
      };
    });
  }, [travels, geocodeMap]);

  const viagensAtribuidas = useMemo(
    () =>
      viagensEnriquecidas.filter(
        (t) => !t.cancelada && (t.realizado === 0 || t.realizado === 1)
      ),
    [viagensEnriquecidas]
  );

  const todasViagensAtribuidas = useMemo(
    () => viagensEnriquecidas.filter((t) => !t.cancelada),
    [viagensEnriquecidas]
  );

  const viagemEmAndamento = useMemo(
    () => viagensAtribuidas.find((v) => v.realizado === 1) || null,
    [viagensAtribuidas]
  );

  useEffect(() => {
    if (viagemEmAndamento) {
      setActiveTravel(viagemEmAndamento.id);
    } else {
      clearActiveTravel();
    }
  }, [viagemEmAndamento, setActiveTravel, clearActiveTravel]);

  const { viagensHoje, viagensFuturas } = useMemo(() => {
    return separateTravelsByDate(viagensAtribuidas);
  }, [viagensAtribuidas]);

  const todasViagensConcluidas = useMemo(() => {
    return viagensEnriquecidas.filter((t) => {
      return t.realizado === 2 && !t.cancelada;
    });
  }, [viagensEnriquecidas]);

  const viagensConcluidasHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return todasViagensConcluidas.filter((t) => {
      if (t.fim) {
        try {
          const fimViagem = new Date(t.fim);
          fimViagem.setHours(0, 0, 0, 0);
          return fimViagem.getTime() === hoje.getTime();
        } catch (e) {
          return true;
        }
      }
      return true;
    });
  }, [todasViagensConcluidas]);

  const openGoogleMaps = (viagem) => {
    const origem = `${viagem.lat_inicio},${viagem.long_inicio}`;
    const destino = `${viagem.lat_fim},${viagem.long_fim}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/${origem}/${destino}`;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      const googleMapsAppUrl = `https://www.google.com/maps/dir/${origem}/${destino}`;
      window.location.href = googleMapsAppUrl;
    } else {
      window.open(googleMapsUrl, "_blank");
    }
  };

  const openWaze = (viagem) => {
    const origem = `${viagem.lat_inicio},${viagem.long_inicio}`;
    const destino = `${viagem.lat_fim},${viagem.long_fim}`;
    const wazeUrl = `https://waze.com/ul?ll=${origem}&navigate=yes&to=ll.${destino}`;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      const wazeAppUrl = `waze://?ll=${origem}&navigate=yes&to=ll.${destino}`;
      window.location.href = wazeAppUrl;
      setTimeout(() => {
        window.location.href = wazeUrl;
      }, 500);
    } else {
      window.open(wazeUrl, "_blank");
    }
  };

  const openNavigationApp = (viagem) => {
    openGoogleMaps(viagem);
  };

  const openNavigationDialog = (viagem) => {
    setTravelToNavigate(viagem);
    setIsNavigationDialogOpen(true);
  };

  const startTravelMutation = useMutation({
    mutationFn: (travelId) => startTravel(travelId),
    onSuccess: (data, travelId) => {
      setActiveTravel(travelId);

      toast.success("Viagem aceita!", {
        description: "A viagem foi iniciada com sucesso.",
        duration: 3000,
      });

      queryClient.invalidateQueries(["driver", "travels", user?.id]);

      const viagem = travels.find((v) => v.id === travelId);
      if (viagem) {
        setTimeout(() => {
          openGoogleMaps(viagem);
        }, 500);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.Erros?.[0] ||
        error.response?.data?.detail ||
        "Erro ao iniciar viagem. Tente novamente.";
      toast.error("Erro ao Iniciar Viagem", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  const endTravelMutation = useMutation({
    mutationFn: (travelId) => endTravel(travelId),
    onSuccess: async () => {
      clearActiveTravel();

      toast.success("Viagem finalizada!", {
        description: "A viagem foi concluída com sucesso.",
        duration: 3000,
      });
      setIsEndTravelDialogOpen(false);
      setTravelToEnd(null);

      queryClient.invalidateQueries({
        queryKey: ["driver", "travels", user?.id],
      });

      setTimeout(() => {
        refetchTravels();
      }, 100);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.Erros?.[0] ||
        error.response?.data?.detail ||
        "Erro ao finalizar viagem. Tente novamente.";
      toast.error("Erro ao finalizar viagem", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  const handleAcceptTravel = (viagem) => {
    const validation = validateTravelAcceptance(
      viagem,
      todasViagensAtribuidas,
      hasActiveTravel()
    );

    if (!validation.canAccept) {
      toast.error("Não é possível iniciar esta viagem", {
        description: validation.message,
        duration: 5000,
      });
      return;
    }

    startTravelMutation.mutate(viagem.id);
  };

  const handleEndTravel = () => {
    if (travelToEnd) {
      endTravelMutation.mutate(travelToEnd.id);
    }
  };

  const openEndTravelDialog = (viagem) => {
    setTravelToEnd(viagem);
    setIsEndTravelDialogOpen(true);
  };

  return (
    <main className="space-y-6 lg:container lg:mx-auto">
      <header className="flex flex-col gap-2">
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          delay={0.15}
          accessible={false}
          className="text-xl md:text-2xl font-bold text-foreground"
        >
          {`Bem-vindo, ${user?.nome || ""}!`}
        </TextAnimate>
        <p className="text-muted-foreground">Suas viagens e tarefas do dia.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isLoadingTravels ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              <Card className="hover:shadow-md transition-all border-l-4 border-l-primary">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-0.5 truncate">
                        Atribuídas
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-primary leading-none">
                        {viagensEnriquecidas.filter((t) => !t.cancelada).length}
                      </p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all border-l-4 border-l-green-600">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-0.5 truncate">
                        Concluídas
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-green-600 leading-none">
                        {todasViagensConcluidas.length}
                      </p>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all border-l-4 border-l-orange-600">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-0.5 truncate">
                        Hoje
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600 leading-none">
                        {viagensHoje.length}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-600">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-0.5 truncate">
                        Ativa
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600 leading-none">
                        {viagemEmAndamento ? "1" : "0"}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                      <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isLoadingTravels
            ? null
            : viagemEmAndamento && (
                <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                        <span className="hidden sm:inline">
                          Viagem em Andamento
                        </span>
                        <span className="sm:hidden">Em Andamento</span>
                      </CardTitle>
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">
                        Ativa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Origem
                        </p>
                        <p className="text-sm font-medium line-clamp-1">
                          {viagemEmAndamento.local_inicio}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Destino
                        </p>
                        <p className="text-sm font-medium line-clamp-1">
                          {viagemEmAndamento.local_fim}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() =>
                          navigate(`/viagens/detalhes/${viagemEmAndamento.id}`)
                        }
                        variant="outline"
                        size="sm"
                        className="flex-1 !bg-gray-100 hover:!bg-gray-200 !text-black"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </Button>
                      <Button
                        onClick={() => openNavigationDialog(viagemEmAndamento)}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-foreground border-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:text-foreground dark:border-blue-800"
                      >
                        <Navigation2 className="h-4 w-4 mr-2" />
                        Abrir Navegação
                      </Button>
                      <Button
                        onClick={() => openEndTravelDialog(viagemEmAndamento)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={endTravelMutation.isPending}
                      >
                        {endTravelMutation.isPending ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Finalizando...
                          </>
                        ) : (
                          <>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Finalizar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

          {/* Viagens de Hoje */}
          {isLoadingTravels ? null : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">
                    Viagens Agendadas para Hoje
                  </span>
                  <span className="sm:hidden">Viagens Hoje</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viagensHoje.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {viagensHoje.slice(0, 5).map((viagem) => {
                        const statusColors = getTravelStatusColors(
                          viagem.realizado
                        );
                        const statusLabel = getTravelStatusLabel(
                          viagem.realizado
                        );

                        return (
                          <Card
                            key={viagem.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <Badge
                                    className={`${statusColors.className} text-xs`}
                                  >
                                    {statusLabel}
                                  </Badge>
                                  <span className="text-sm font-semibold">
                                    {formatarHora(viagem.inicio)}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Origem
                                    </p>
                                    <p className="text-sm font-medium line-clamp-2">
                                      {viagem.local_inicio}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Destino
                                    </p>
                                    <p className="text-sm font-medium line-clamp-2">
                                      {viagem.local_fim}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={() =>
                                      navigate(`/viagens/detalhes/${viagem.id}`)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver detalhes
                                  </Button>
                                  {viagem.realizado ===
                                    TravelStatus.NAO_REALIZADO && (
                                    <Button
                                      onClick={() => handleAcceptTravel(viagem)}
                                      size="sm"
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      disabled={startTravelMutation.isPending}
                                    >
                                      {startTravelMutation.isPending ? (
                                        <>
                                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                                          Aceitando...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Iniciar Viagem
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {viagensHoje.length > 5 && (
                      <div className="mt-3 pt-3 border-t text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/agendamentos")}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver todas ({viagensHoje.length})
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 md:p-12 text-center">
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <div className="p-3 md:p-4 bg-muted rounded-full">
                        <Calendar
                          className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-1">
                          Nenhuma viagem para hoje
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Não há viagens agendadas para hoje.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isLoadingTravels
            ? null
            : viagensAtribuidas.length === 0 && (
                <Card>
                  <CardContent className="p-8 md:p-12 text-center">
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <div className="p-3 md:p-4 bg-muted rounded-full">
                        <Truck
                          className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-1">
                          Nenhuma viagem atribuída
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Aguarde o gerente atribuir viagens para você.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
        </div>

        <div className="hidden lg:block space-y-6">
          {viagensConcluidasHoje.length > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/10">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600">
                    {viagensConcluidasHoje.length}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {viagensConcluidasHoje.length === 1
                      ? "Viagem concluída"
                      : "Viagens concluídas"}{" "}
                    hoje
                  </p>
                  <CheckCircle
                    className="h-12 w-12 mx-auto text-green-600/30 mt-2"
                    aria-hidden="true"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total atribuídas
                </span>
                <span className="font-semibold">
                  {viagensAtribuidas.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Concluídas hoje
                </span>
                <span className="font-semibold text-green-600">
                  {viagensConcluidasHoje.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Viagens hoje
                </span>
                <span className="font-semibold text-orange-600">
                  {viagensHoje.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {isLoadingTravels
            ? null
            : viagensFuturas.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-4 w-4" />
                      Próximas Viagens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {viagensFuturas.slice(0, 3).map((viagem) => {
                        const statusColors = getTravelStatusColors(
                          viagem.realizado
                        );
                        const statusLabel = getTravelStatusLabel(
                          viagem.realizado
                        );

                        return (
                          <div
                            key={viagem.id}
                            className="p-3 border rounded-lg space-y-2 opacity-75"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                className={`${statusColors.className} text-xs`}
                              >
                                {statusLabel}
                              </Badge>
                              <span className="text-xs font-semibold">
                                {formatarHora(viagem.inicio)}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div>
                                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  Origem
                                </p>
                                <p className="text-xs font-medium line-clamp-1">
                                  {viagem.local_inicio}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  Destino
                                </p>
                                <p className="text-xs font-medium line-clamp-1">
                                  {viagem.local_fim}
                                </p>
                              </div>
                            </div>

                            <Button
                              onClick={() =>
                                navigate(`/viagens/detalhes/${viagem.id}`)
                              }
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-7"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver detalhes
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                    {viagensFuturas.length > 3 && (
                      <div className="mt-3 pt-3 border-t text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/agendamentos")}
                          className="w-full text-xs h-7"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver todas ({viagensFuturas.length})
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
        </div>
      </div>

      <AlertDialog
        open={isEndTravelDialogOpen}
        onOpenChange={setIsEndTravelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Finalizar Viagem
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar esta viagem? Esta ação não pode
              ser desfeita.
              {travelToEnd && (
                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Origem:</span>{" "}
                    {travelToEnd.local_inicio || "Carregando..."}
                  </div>
                  <div>
                    <span className="font-medium">Destino:</span>{" "}
                    {travelToEnd.local_fim || "Carregando..."}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndTravel}
              className="bg-green-600 hover:bg-green-700"
              disabled={endTravelMutation.isPending}
            >
              {endTravelMutation.isPending
                ? "Finalizando..."
                : "Finalizar Viagem"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de escolha de navegação */}
      <AlertDialog
        open={isNavigationDialogOpen}
        onOpenChange={setIsNavigationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <Navigation2 className="h-5 w-5 text-blue-600" />
              Escolher App de Navegação
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o app de navegação que deseja usar:
              {travelToNavigate && (
                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Origem:</span>{" "}
                    {travelToNavigate.local_inicio || "Carregando..."}
                  </div>
                  <div>
                    <span className="font-medium">Destino:</span>{" "}
                    {travelToNavigate.local_fim || "Carregando..."}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (travelToNavigate) {
                  openWaze(travelToNavigate);
                }
                setIsNavigationDialogOpen(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              <Navigation2 className="h-4 w-4 mr-2" />
              Abrir Waze
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                if (travelToNavigate) {
                  openGoogleMaps(travelToNavigate);
                }
                setIsNavigationDialogOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Abrir Google Maps
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default memo(DriverView);
