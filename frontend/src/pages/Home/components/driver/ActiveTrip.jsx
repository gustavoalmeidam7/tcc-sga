import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Eye, CheckCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { formatarHora } from "@/lib/date-utils";

export const ActiveTrip = memo(({ viagem }) => {
  const navigate = useNavigate();

  if (!viagem) return null;

  return (
    <Card className="border-blue-500/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Viagem em Andamento
          </CardTitle>
          <Badge className="bg-blue-600 hover:bg-blue-700">
            Ativa
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Origem
              </p>
              <p className="text-sm font-medium">
                {viagem.local_inicio || "Carregando..."}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Destino
              </p>
              <p className="text-sm font-medium">
                {viagem.local_fim || "Carregando..."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Horário de Início
              </p>
              <p className="text-sm font-medium">
                {formatarHora(viagem.inicio)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={() => navigate(`/viagens/detalhes/${viagem.id}`)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            Ver detalhes
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCheck className="h-4 w-4 mr-2" aria-hidden="true" />
            Finalizar Viagem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
