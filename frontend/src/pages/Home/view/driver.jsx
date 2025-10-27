import { useMemo, useState, memo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { getTravels } from "@/services/travelService";
import { formatarDataHora, formatarHora } from "@/lib/date-utils";
import {
  getTravelStatusLabel,
  getTravelStatusColors,
} from "@/lib/travel-status";
import { useNavigate } from "react-router-dom";

function DriverView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: travels = [] } = useQuery({
    queryKey: ["travels", "driver", user?.id],
    queryFn: () => getTravels(100, 0),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const viagensMock = useMemo(() => {
    if (!user?.id) return [];

    const hoje = new Date();
    const hojeMais1h = new Date(hoje.getTime() + 60 * 60 * 1000);
    const hojeMais3h = new Date(hoje.getTime() + 3 * 60 * 60 * 1000);
    const hojeMenos2h = new Date(hoje.getTime() - 2 * 60 * 60 * 1000);
    const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);

    return [
      {
        id: "mock-1",
        id_motorista: user.id,
        id_paciente: "paciente-1",
        realizado: 1,
        inicio: hojeMenos2h.toISOString(),
        fim: null,
        local_inicio: "Rua das Flores, 123 - Centro, São Carlos - SP",
        local_fim: "Santa Casa de São Carlos - Rua Paulino Botelho, 573",
        criado_em: hojeMenos2h.toISOString(),
      },
      {
        id: "mock-2",
        id_motorista: user.id,
        id_paciente: "paciente-2",
        realizado: 0,
        inicio: hojeMais1h.toISOString(),
        fim: null,
        local_inicio:
          "Avenida São Carlos, 2000 - Jardim Paraíso, São Carlos - SP",
        local_fim: "Hospital Unimed - Rua Conde do Pinhal, 1234",
        criado_em: hoje.toISOString(),
      },
      {
        id: "mock-3",
        id_motorista: user.id,
        id_paciente: "paciente-3",
        realizado: 0,
        inicio: hojeMais3h.toISOString(),
        fim: null,
        local_inicio:
          "Joaquim Augusto Ribeiro de Souza, s/nº - Santa Felícia, São Carlos - SP",
        local_fim: "UPA São Carlos - Rua Dona Alexandrina, 1155",
        criado_em: hoje.toISOString(),
      },
      {
        id: "mock-4",
        id_motorista: user.id,
        id_paciente: "paciente-4",
        realizado: 0,
        inicio: amanha.toISOString(),
        fim: null,
        local_inicio: "Rua Episcopal, 1000 - Centro, São Carlos - SP",
        local_fim: "Clínica São Lucas - Rua Marechal Deodoro, 500",
        criado_em: hoje.toISOString(),
      },
      {
        id: "mock-5",
        id_motorista: user.id,
        id_paciente: "paciente-5",
        realizado: 2,
        inicio: new Date(hoje.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        fim: new Date(hoje.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        local_inicio: "Rua XV de Novembro, 789 - Vila Prado, São Carlos - SP",
        local_fim: "Santa Casa de São Carlos - Rua Paulino Botelho, 573",
        criado_em: new Date(hoje.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "mock-6",
        id_motorista: user.id,
        id_paciente: "paciente-6",
        realizado: 2,
        inicio: new Date(hoje.getTime() - 7 * 60 * 60 * 1000).toISOString(),
        fim: new Date(hoje.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        local_inicio:
          "Avenida Trabalhador São-Carlense, 2500 - Cidade Aracy, São Carlos - SP",
        local_fim: "Hospital Unimed - Rua Conde do Pinhal, 1234",
        criado_em: new Date(hoje.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }, [user?.id]);

  const allTravels = viagensMock.length > 0 ? viagensMock : travels;

  const viagensAtribuidas = useMemo(
    () =>
      allTravels.filter(
        (t) =>
          t.id_motorista === user?.id &&
          (t.realizado === 0 || t.realizado === 1)
      ),
    [allTravels, user?.id]
  );

  const viagemEmAndamento = useMemo(
    () => viagensAtribuidas.find((v) => v.realizado === 1) || null,
    [viagensAtribuidas]
  );

  const viagensConcluidasHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return allTravels.filter((t) => {
      if (t.id_motorista !== user?.id || t.realizado !== 2) return false;

      const fimViagem = new Date(t.fim);
      fimViagem.setHours(0, 0, 0, 0);

      return fimViagem.getTime() === hoje.getTime();
    });
  }, [allTravels, user?.id]);

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
      <header className="flex flex-col gap-4">
        <div>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            delay={0.15}
            className="text-xl md:text-2xl font-bold text-foreground"
          >
            {`Bem-vindo, ${user?.nome || ""}!`}
          </TextAnimate>
          <p className="text-muted-foreground">
            Suas viagens e tarefas do dia.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary">
                  {viagensAtribuidas.length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Atribuídas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {viagensConcluidasHoje.length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Concluídas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-orange-600">
                  {viagensHoje.length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {viagemEmAndamento ? "1" : "0"}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Ativa
                </p>
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
                <span className="hidden sm:inline">Viagem em Andamento</span>
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
                className="md:flex-1 !bg-gray-100 hover:!bg-gray-200"
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
                const statusColors = getTravelStatusColors(viagem.realizado);
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
                <Truck className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
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
    </main>
  );
}

export default memo(DriverView);
