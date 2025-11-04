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
import { createUpgradeToken } from "@/services/managerService";
import { showErrorToast, showSuccessToast } from "@/lib/error-utils";
import { Copy, Check, Sparkles } from "lucide-react";

export function GenerateTokenModal({ open, onOpenChange }) {
  const [generatedToken, setGeneratedToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateMutation = useMutation({
    mutationFn: createUpgradeToken,
    onSuccess: (data) => {
      const token = data?.id;
      setGeneratedToken(token);
      showSuccessToast("Chave gerada!", {
        description: "Chave de acesso criada com sucesso.",
      });
    },
    onError: (error) => {
      showErrorToast(error, "Erro ao gerar chave", {
        defaultMessage:
          "Não foi possível gerar a chave de acesso. Tente novamente.",
      });
    },
  });

  const handleCopy = async () => {
    if (!generatedToken) return;

    try {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      showSuccessToast("Copiado!", {
        description: "Chave copiado para a área de transferência.",
        duration: 2000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showErrorToast(error, "Erro ao copiar", {
        defaultMessage: "Não foi possível copiar a chave.",
      });
    }
  };

  const handleClose = () => {
    setGeneratedToken(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Gerar Chave de acesso para Motorista
          </DialogTitle>
          <DialogDescription>
            Crie uma chave de acesso para transformar um usuário em motorista do
            sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!generatedToken ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Clique no botão abaixo para gerar uma nova chave de acesso.
              </p>
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                size="lg"
                className="w-full"
              >
                {generateMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Chave
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="token">Chave Gerada</Label>
              <div className="flex gap-2">
                <Input
                  id="token"
                  value={generatedToken}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ Compartilhe esta chave apenas com o usuário que você deseja
                promover a motorista. A chave pode ser usada uma única vez.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
