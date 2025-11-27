import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import authService from "@/services/authService";
import { User } from "lucide-react";

export function AssignDriverModal({ open, onOpenChange, ambulance, onAssigned }) {
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => authService.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const motoristas = users.filter((u) => u.cargo === 1);

  useEffect(() => {
    if (ambulance?.motorista_id) {
      setSelectedDriverId(ambulance.motorista_id);
    } else {
      setSelectedDriverId("");
    }
  }, [ambulance]);

  const handleAssign = () => {
    if (!selectedDriverId) {
      return;
    }
    onAssigned(ambulance.id, selectedDriverId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            Atribuir Motorista à Ambulância
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Selecione o motorista que será atribuído à ambulância{" "}
            <strong className="font-mono text-foreground">{ambulance?.placa}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="driver" className="text-foreground">Motorista</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedDriverId}
                onValueChange={setSelectedDriverId}
              >
                <SelectTrigger id="driver" className="text-foreground">
                  <SelectValue placeholder="Selecione um motorista" className="text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  {motoristas.length === 0 ? (
                    <SelectItem value="none" disabled className="text-foreground">
                      Nenhum motorista disponível
                    </SelectItem>
                  ) : (
                    motoristas.map((motorista) => (
                      <SelectItem key={motorista.id} value={motorista.id} className="text-foreground">
                        {motorista.nome} {motorista.email && `(${motorista.email})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDriverId || isLoading}
          >
            Atribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

