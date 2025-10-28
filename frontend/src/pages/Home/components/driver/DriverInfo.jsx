import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Ambulance,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { memo } from "react";
import { formatarData } from "@/lib/date-utils";

export const DriverInfo = memo(({ driver }) => {
  if (!driver) return null;

  const cnhVencida = driver.vencimento
    ? new Date(driver.vencimento) < new Date()
    : false;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" aria-hidden="true" />
          Informações do Motorista
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm font-medium">CNH</p>
            </div>
            {cnhVencida && (
              <Badge variant="destructive" className="text-xs">
                Vencida
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {driver.cnh || "Não informado"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Validade</p>
          </div>
          <p
            className={`text-sm pl-6 ${
              cnhVencida
                ? "text-destructive font-medium"
                : "text-muted-foreground"
            }`}
          >
            {driver.vencimento
              ? formatarData(driver.vencimento)
              : "Não informado"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ambulance
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Ambulância</p>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {driver.id_ambulancia
              ? `ID: ${driver.id_ambulancia.slice(0, 8)}...`
              : "Não atribuída"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Status</p>
          </div>
          <div className="pl-6">
            <Badge
              variant={driver.em_viagem ? "default" : "secondary"}
              className="text-xs"
            >
              {driver.em_viagem ? "Em Viagem" : "Disponível"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
