import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmbulanceStatus, AmbulanceType } from "@/lib/ambulance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatLicensePlate } from "@/lib/utils";

export function CreateAmbulanceModal({
  open,
  onOpenChange,
  onAmbulanceCreated,
}) {
  const [formData, setFormData] = useState({
    placa: "",
    tipo: "",
    status: AmbulanceStatus.ACTIVE,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      placa: "",
      tipo: "",
      status: AmbulanceStatus.ACTIVE,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.placa || !formData.tipo) {
      toast.error("Campos obrigatórios", {
        description: "Preencha todos os campos obrigatórios.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAmbulanceCreated?.({
        placa: formData.placa,
        tipo: parseInt(formData.tipo),
        status: parseInt(formData.status),
      });

      onOpenChange(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao criar ambulância:", err);
      toast.error("Erro ao criar ambulância", {
        description:
          err.message ||
          "Não foi possível criar a ambulância. Tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Adicionar Ambulância
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações para adicionar uma nova ambulância ao
            sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="placa"
                className="text-sm font-semibold text-foreground"
              >
                Placa *
              </Label>
              <Input
                id="placa"
                name="placa"
                type="text"
                placeholder="Ex: ABC-1234"
                value={formData.placa}
                onChange={(e) => {
                  const formatted = formatLicensePlate(e.target.value);
                  setFormData({
                    ...formData,
                    placa: formatted,
                  });
                }}
                className="h-10 text-foreground"
                maxLength={8}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="create-tipo"
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
                  id="create-tipo"
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
                htmlFor="create-status"
                className="text-sm font-semibold text-foreground"
              >
                Status Inicial
              </Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: parseInt(value) })
                }
              >
                <SelectTrigger
                  id="create-status"
                  name="status"
                  className="h-10 text-foreground [&>*[data-slot=select-value]]:text-foreground"
                >
                  <SelectValue className="text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={AmbulanceStatus.ACTIVE.toString()}
                    className="text-foreground"
                  >
                    Disponível
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
                  Criando...
                </>
              ) : (
                "Criar Ambulância"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
