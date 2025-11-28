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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmbulanceStatus, AmbulanceType } from "@/lib/ambulance";
import {
  updateAmbulance,
  addEquipment,
  deleteEquipment,
  getAmbulanceById,
} from "@/services/ambulanceService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Wrench, Plus, Trash2 } from "lucide-react";

export function ConfigureAmbulanceModal({
  open,
  onOpenChange,
  ambulance,
  onAmbulanceUpdated,
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    tipo: "",
    status: "",
    equipamentos: [],
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        tipo: "",
        status: "",
        equipamentos: [],
      });
      setNovoEquipamento({
        nome: "",
        descricao: "",
      });
    }
  }, [open]);

  const [novoEquipamento, setNovoEquipamento] = useState({
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    if (ambulance && open) {
      setFormData({
        tipo: ambulance.tipo?.toString() || "",
        status: ambulance.status?.toString() || "",
        equipamentos: Array.isArray(ambulance.equipamentos)
          ? ambulance.equipamentos
          : ambulance.equipamentos
          ? [ambulance.equipamentos]
          : [],
      });
    } else if (!ambulance) {
      setFormData({
        tipo: "",
        status: "",
        equipamentos: [],
      });
    }
  }, [ambulance, open]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const adicionarEquipamento = async () => {
    if (!novoEquipamento.nome.trim()) {
      toast.error("Nome obrigatório", {
        description: "Digite o nome do equipamento.",
        duration: 3000,
      });
      return;
    }

    if (!ambulance?.id) {
      toast.error("Erro", {
        description: "ID da ambulância não encontrado.",
        duration: 3000,
      });
      return;
    }

    try {
      const equipmentData = {
        nome: novoEquipamento.nome.trim(),
        descricao: novoEquipamento.descricao.trim() || "",
      };

      await addEquipment(ambulance.id, equipmentData);

      toast.success("Equipamento adicionado!", {
        description: "O equipamento foi adicionado com sucesso.",
        duration: 3000,
      });

      await queryClient.invalidateQueries(["ambulance", ambulance.id]);
      await queryClient.invalidateQueries(["ambulances"]);

      const updatedAmbulance = await queryClient.fetchQuery({
        queryKey: ["ambulance", ambulance.id],
        queryFn: () => getAmbulanceById(ambulance.id),
      });

      if (updatedAmbulance) {
        setFormData((prev) => ({
          ...prev,
          equipamentos: Array.isArray(updatedAmbulance.equipamentos)
            ? updatedAmbulance.equipamentos
            : [],
        }));
      }

      setNovoEquipamento({ nome: "", descricao: "" });
    } catch (error) {
      console.error("Erro ao adicionar equipamento:", error);
      toast.error("Erro ao adicionar equipamento", {
        description:
          error.response?.data?.mensagem ||
          error.response?.data?.erro ||
          error.message ||
          "Não foi possível adicionar o equipamento. Tente novamente.",
        duration: 5000,
      });
    }
  };

  const removerEquipamento = async (equipamento, index) => {
    if (!equipamento.id || !ambulance?.id) {
      setFormData((prev) => ({
        ...prev,
        equipamentos: (prev.equipamentos || []).filter((_, i) => i !== index),
      }));
      return;
    }

    try {
      await deleteEquipment(equipamento.id);

      toast.success("Equipamento removido!", {
        description: "O equipamento foi removido com sucesso.",
        duration: 3000,
      });

      queryClient.invalidateQueries(["ambulance", ambulance.id]);
      queryClient.invalidateQueries(["ambulances"]);

      setFormData((prev) => ({
        ...prev,
        equipamentos: (prev.equipamentos || []).filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Erro ao remover equipamento:", error);
      toast.error("Erro ao remover equipamento", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível remover o equipamento. Tente novamente.",
        duration: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipo || formData.status === "") {
      if (ambulance) {
        setFormData({
          ...formData,
          tipo: ambulance.tipo?.toString() || "",
          status: ambulance.status?.toString() || "",
        });
      } else {
        toast.error("Campos obrigatórios", {
          description: "Tipo e Status são obrigatórios.",
          duration: 3000,
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        tipo: parseInt(formData.tipo),
        status: parseInt(formData.status),
      };

      await updateAmbulance(ambulance.id, updateData);

      queryClient.invalidateQueries(["ambulance", ambulance.id]);
      queryClient.invalidateQueries(["ambulances"]);

      toast.success("Ambulância atualizada!", {
        description: "As configurações foram salvas com sucesso.",
        duration: 3000,
      });

      onAmbulanceUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar ambulância:", error);
      toast.error("Erro ao atualizar", {
        description:
          error.response?.data?.mensagem ||
          "Não foi possível salvar as alterações. Tente novamente.",
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wrench className="h-5 w-5" />
            Configurar Ambulância
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize as informações da ambulância, incluindo tipo, status e
            equipamentos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="configure-tipo" className="text-foreground">
                Tipo
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger
                  id="configure-tipo"
                  name="tipo"
                  className="text-foreground [&>*[data-slot=select-value]]:text-foreground"
                >
                  <SelectValue
                    placeholder="Selecione o tipo"
                    className="text-foreground"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className="text-foreground">
                    Tipo A
                  </SelectItem>
                  <SelectItem value="1" className="text-foreground">
                    Tipo B
                  </SelectItem>
                  <SelectItem value="2" className="text-foreground">
                    Tipo C
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="configure-status" className="text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger
                  id="configure-status"
                  name="status"
                  className="text-foreground [&>*[data-slot=select-value]]:text-foreground"
                >
                  <SelectValue
                    placeholder="Selecione o status"
                    className="text-foreground"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className="text-foreground">
                    Em Uso
                  </SelectItem>
                  <SelectItem value="1" className="text-foreground">
                    Disponível
                  </SelectItem>
                  <SelectItem value="2" className="text-foreground">
                    Inativa
                  </SelectItem>
                  <SelectItem value="3" className="text-foreground">
                    Em Manutenção
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.equipamentos && formData.equipamentos.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground">Equipamentos Atuais</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {(formData.equipamentos || []).map((equip, index) => (
                  <div
                    key={equip.id || index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {equip.nome || equip.equipamento}
                      </p>
                      {equip.descricao && (
                        <p className="text-xs text-muted-foreground">
                          {equip.descricao}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerEquipamento(equip, index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.equipamentos && formData.equipamentos.length > 0 && (
            <div className="border-t pt-4" />
          )}

          <div className="space-y-4">
            <Label htmlFor="novo-equipamento-nome" className="text-foreground">
              Adicionar Equipamento
            </Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label
                  htmlFor="novo-equipamento-nome"
                  className="text-sm text-muted-foreground"
                >
                  Nome do equipamento
                </Label>
                <Input
                  id="novo-equipamento-nome"
                  name="novo-equipamento-nome"
                  value={novoEquipamento.nome}
                  onChange={(e) =>
                    setNovoEquipamento({
                      ...novoEquipamento,
                      nome: e.target.value,
                    })
                  }
                  placeholder="Nome do equipamento..."
                  className="text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="novo-equipamento-descricao"
                  className="text-sm text-muted-foreground"
                >
                  Descrição do equipamento (opcional)
                </Label>
                <Textarea
                  id="novo-equipamento-descricao"
                  name="novo-equipamento-descricao"
                  value={novoEquipamento.descricao}
                  onChange={(e) =>
                    setNovoEquipamento({
                      ...novoEquipamento,
                      descricao: e.target.value,
                    })
                  }
                  placeholder="Descrição do equipamento (opcional)..."
                  rows={2}
                  className="text-foreground"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarEquipamento}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Equipamento
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
