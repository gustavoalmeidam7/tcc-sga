import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmbulanceStatus, AmbulanceType } from "@/lib/ambulance";
import { updateAmbulance } from "@/services/ambulanceService";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EditAmbulanceModal({
  open,
  onOpenChange,
  ambulance,
  onAmbulanceUpdated,
}) {
  const [formData, setFormData] = useState({
    tipo: "",
    status: "",
  });

  useEffect(() => {
    if (ambulance) {
      setFormData({
        tipo: ambulance.tipo?.toString() || "",
        status: ambulance.status?.toString() || "",
      });
    }
  }, [ambulance]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipo || formData.status === "") {
      toast.error("Campos obrigatórios", {
        description: "Preencha todos os campos obrigatórios.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAmbulanceUpdated?.(ambulance.id, {
        tipo: parseInt(formData.tipo),
        status: parseInt(formData.status),
      });

      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao atualizar ambulância:", err);
      toast.error("Erro ao atualizar ambulância", {
        description:
          err.message ||
          "Não foi possível atualizar a ambulância. Tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  if (!ambulance) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Editar Ambulância
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize as informações da ambulância {ambulance.placa}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium text-muted-foreground">
                Placa
              </Label>
              <p className="text-lg font-mono font-semibold text-foreground mt-1">
                {ambulance.placa}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                A placa não pode ser alterada
              </p>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="edit-tipo"
                className="text-sm font-semibold text-foreground"
              >
                Tipo *
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo: value })
                }
                required
              >
                <SelectTrigger
                  id="edit-tipo"
                  name="tipo"
                  className="h-10 text-foreground [&>*[data-slot=select-value]]:text-foreground"
                >
                  <SelectValue
                    placeholder="Selecione o tipo"
                    className="text-foreground"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={AmbulanceType.A.toString()}
                    className="text-foreground"
                  >
                    Tipo A
                  </SelectItem>
                  <SelectItem
                    value={AmbulanceType.B.toString()}
                    className="text-foreground"
                  >
                    Tipo B
                  </SelectItem>
                  <SelectItem
                    value={AmbulanceType.C.toString()}
                    className="text-foreground"
                  >
                    Tipo C
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="edit-status"
                className="text-sm font-semibold text-foreground"
              >
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger
                  id="edit-status"
                  name="status"
                  className="h-10 text-foreground [&>*[data-slot=select-value]]:text-foreground"
                >
                  <SelectValue
                    placeholder="Selecione o status"
                    className="text-foreground"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={AmbulanceStatus.ACTIVE.toString()}
                    className="text-foreground"
                  >
                    Disponível
                  </SelectItem>
                  <SelectItem
                    value={AmbulanceStatus.IN_USE.toString()}
                    className="text-foreground"
                  >
                    Em Uso
                  </SelectItem>
                  <SelectItem
                    value={AmbulanceStatus.INACTIVE.toString()}
                    className="text-foreground"
                  >
                    Inativa
                  </SelectItem>
                  <SelectItem
                    value={AmbulanceStatus.MAINTENANCE.toString()}
                    className="text-foreground"
                  >
                    Em Manutenção
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-foreground"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
