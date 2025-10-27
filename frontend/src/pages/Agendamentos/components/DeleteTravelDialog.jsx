import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { formatarDataHora } from "@/lib/date-utils";

function DeleteTravelDialog({ viagem, isOpen, isPending, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este agendamento?
          </DialogDescription>
        </DialogHeader>

        {viagem && (
          <div className="space-y-2 py-4">
            <p className="text-sm text-foreground">
              <strong>Data:</strong> {formatarDataHora(viagem.inicio)}
            </p>
            <p className="text-sm text-foreground">
              <strong>Origem:</strong> {viagem.local_inicio}
            </p>
            <p className="text-sm text-foreground">
              <strong>Destino:</strong> {viagem.local_fim}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(DeleteTravelDialog);
