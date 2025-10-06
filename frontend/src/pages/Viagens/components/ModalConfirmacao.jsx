import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Navigation, User, Calendar, Clock } from "lucide-react";
import { formatarData } from "@/lib/date-utils";

export function ModalConfirmacao({
  open,
  onOpenChange,
  dadosViagem
}) {
  if (!dadosViagem) return null;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Viagem Confirmada!
          </DialogTitle>
          <DialogDescription className="text-center">
            A ambulância foi solicitada com sucesso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Paciente</p>
              <p className="text-sm text-muted-foreground">{dadosViagem.nomePaciente}</p>
              <p className="text-xs text-muted-foreground">{dadosViagem.cpfPaciente}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Data e Hora</p>
              <p className="text-sm text-muted-foreground">
                {formatarData(new Date(dadosViagem.dataAgendamento).toISOString())} às {dadosViagem.horaAgendamento}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Origem</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{dadosViagem.origem}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Destino</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{dadosViagem.destino}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Duração Estimada</p>
              <p className="text-sm text-muted-foreground">
                {dadosViagem.distancia} km • {dadosViagem.duracao} min
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}