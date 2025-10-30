import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { upgradeAccount } from "@/services/managerService";
import { showErrorToast, showSuccessToast } from "@/lib/error-utils";
import { Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UpgradeAccountModal({ open, onOpenChange }) {
  const [token, setToken] = useState("");
  const { refreshUser } = useAuth();

  const upgradeMutation = useMutation({
    mutationFn: upgradeAccount,
    onSuccess: async () => {
      showSuccessToast("Conta atualizada!", {
        description: "Você agora é um gerente do sistema. Recarregando...",
      });

      await refreshUser();

      setTimeout(() => {
        onOpenChange(false);
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      showErrorToast(error, "Erro ao fazer upgrade", {
        defaultMessage:
          "Token inválido ou já utilizado. Verifique e tente novamente.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token.trim()) {
      showErrorToast({ message: "Token vazio" }, "Token obrigatório", {
        defaultMessage: "Por favor, insira um token de upgrade.",
      });
      return;
    }

    upgradeMutation.mutate(token.trim());
  };

  const handleClose = () => {
    if (!upgradeMutation.isPending) {
      setToken("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Crown className="h-5 w-5 text-yellow-500" />
            Fazer Upgrade para Gerente
          </DialogTitle>
          <DialogDescription>
            Insira o token de upgrade fornecido por um administrador para se
            tornar gerente do sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upgrade-token" className="text-foreground">
              Token de Upgrade
            </Label>
            <Input
              id="upgrade-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Cole o token aqui"
              className="font-mono"
              disabled={upgradeMutation.isPending}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              O token pode ser usado apenas uma vez e expira após o uso.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={upgradeMutation.isPending}
              className="m-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={upgradeMutation.isPending || !token.trim()}
              className="m-1"
            >
              {upgradeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Fazer Upgrade
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
