import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { formatarHora } from "@/lib/date-utils";
import {
  getTravelStatusColors,
  getTravelStatusLabel,
} from "@/lib/travel-status";

export const TodayTrips = memo(({ viagens, totalAtribuidas }) => {
  const navigate = useNavigate();

  if (viagens.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" aria-hidden="true" />
          Viagens Agendadas para Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {viagens.map((viagem) => {
            const statusColors = getTravelStatusColors(viagem.realizado);
            const statusLabel = getTravelStatusLabel(viagem.realizado);

            return (
              <Card
                key={viagem.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={`${statusColors.className} text-xs`}>
                          {statusLabel}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatarHora(viagem.inicio)}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            Origem
                          </p>
                          <p className="text-sm font-medium line-clamp-1">
                            {viagem.local_inicio || "Carregando..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            Destino
                          </p>
                          <p className="text-sm font-medium line-clamp-1">
                            {viagem.local_fim || "Carregando..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/viagens/detalhes/${viagem.id}`)}
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {totalAtribuidas > viagens.length && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/agendamentos")}
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              Ver todas as viagens ({totalAtribuidas})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
