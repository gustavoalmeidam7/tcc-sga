import { useMemo, memo } from "react";
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
} from "lucide-react";
import { getDriverInfo, getDriverTravels } from "@/services/driverService";
import { formatarHora } from "@/lib/date-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
} from "@/lib/travel-status";
import { useNavigate } from "react-router-dom";
import { reverseGeocode } from "@/hooks/useReverseGeocode";

function DriverView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // TEMPORARIAMENTE DESABILITADO: Backend tem bug com motoristas sem ambulância
  // const { data: driverInfo } = useQuery({
  //   queryKey: ["driver", "info", user?.id],
  //   queryFn: getDriverInfo,
  //   enabled: false,
  //   staleTime: 1000 * 60 * 5,
  // });

  // const { data: travelsResponse } = useQuery({
  //   queryKey: ["driver", "travels", user?.id],
  //   queryFn: getDriverTravels,
  //   enabled: false,
  //   staleTime: 1000 * 60 * 2,
  // });

  const driverInfo = null;
  const travelsResponse = { viagens: [] };

  const travels = useMemo(
    () => travelsResponse?.viagens || [],
    [travelsResponse]
  );

  const geocodeQueries = useQueries({
    queries: travels.flatMap((v) => [
      {
        queryKey: ["geocode", v.lat_inicio, v.long_inicio],
        queryFn: () => reverseGeocode(v.lat_inicio, v.long_inicio),
        enabled: !!(v.lat_inicio && v.long_inicio),
        staleTime: 1000 * 60 * 60 * 24,
      },
      {
        queryKey: ["geocode", v.lat_fim, v.long_fim],
        queryFn: () => reverseGeocode(v.lat_fim, v.long_fim),
        enabled: !!(v.lat_fim && v.long_fim),
        staleTime: 1000 * 60 * 60 * 24,
      },
    ]),
  });

  const viagensEnriquecidas = useMemo(() => {
    if (!travels.length) return [];

    return travels.map((viagem, index) => ({
      ...viagem,
      local_inicio: geocodeQueries[index * 2]?.data || "Carregando...",
      local_fim: geocodeQueries[index * 2 + 1]?.data || "Carregando...",
    }));
  }, [travels, geocodeQueries]);

  const viagensAtribuidas = useMemo(
    () =>
      viagensEnriquecidas.filter((t) => t.realizado === 0 || t.realizado === 1),
    [viagensEnriquecidas]
  );

  const viagemEmAndamento = useMemo(
    () => viagensAtribuidas.find((v) => v.realizado === 1) || null,
    [viagensAtribuidas]
  );

  const viagensConcluidasHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return viagensEnriquecidas.filter((t) => {
      if (t.realizado !== 2) return false;

      const fimViagem = new Date(t.fim);
      fimViagem.setHours(0, 0, 0, 0);

      return fimViagem.getTime() === hoje.getTime();
    });
  }, [viagensEnriquecidas]);

  const viagensHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return viagensAtribuidas.filter((v) => {
      const dataViagem = new Date(v.inicio);
      dataViagem.setHours(0, 0, 0, 0);
      return dataViagem.getTime() === hoje.getTime();
    });
  }, [viagensAtribuidas]);

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
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Atribuídas
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                      {viagensAtribuidas.length}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-primary/10 rounded-xl">
                    <Truck
                      className="h-6 w-6 md:h-8 md:w-8 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Concluídas
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                      {viagensConcluidasHoje.length}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-green-500/10 rounded-xl">
                    <CheckCircle
                      className="h-6 w-6 md:h-8 md:w-8 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Hoje
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600">
                      {viagensHoje.length}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-orange-500/10 rounded-xl">
                    <Clock
                      className="h-6 w-6 md:h-8 md:w-8 text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      Ativa
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                      {viagemEmAndamento ? "1" : "0"}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-blue-500/10 rounded-xl">
                    <Navigation
                      className="h-6 w-6 md:h-8 md:w-8 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {viagemEmAndamento && (
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
                    className="md:flex-1 !bg-gray-100 hover:!bg-gray-200 !text-black"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalhes
                  </Button>
                  <Button
                    size="sm"
                    className="md:flex-1 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Finalizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {viagensHoje.length > 0 && (
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
                <div className="space-y-3">
                  {viagensHoje.map((viagem) => {
                    const statusColors = getTravelStatusColors(
                      viagem.realizado
                    );
                    const statusLabel = getTravelStatusLabel(viagem.realizado);

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

                            <Button
                              onClick={() =>
                                navigate(`/viagens/detalhes/${viagem.id}`)
                              }
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {viagensAtribuidas.length > viagensHoje.length && (
                  <div className="mt-3 pt-3 border-t text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/agendamentos")}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver todas ({viagensAtribuidas.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {viagensAtribuidas.length === 0 && (
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
        </div>
      </div>
    </main>
  );
}

export default memo(DriverView);
