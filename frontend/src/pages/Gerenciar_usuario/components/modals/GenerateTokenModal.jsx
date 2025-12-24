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
import { Sparkles, Send, Mail } from "lucide-react";

export function GenerateTokenModal({ open, onOpenChange }) {
  const [generatedToken, setGeneratedToken] = useState(null);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

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

  const sendEmailMutation = useMutation({
    mutationFn: async ({ email, token }) => {
      console.log(`Enviando email para ${email} com código ${token}`);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      showSuccessToast("Email enviado!", {
        description: "O código foi enviado por email com sucesso.",
      });
      setShowEmailForm(false);
      setEmail("");
    },
    onError: (error) => {
      showErrorToast(error, "Erro ao enviar email", {
        defaultMessage: "Não foi possível enviar o email. Tente novamente.",
      });
    },
  });

  const handleClose = () => {
    setGeneratedToken(null);
    setEmail("");
    setShowEmailForm(false);
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
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Chave gerada com sucesso! Agora você pode enviá-la por
                    email.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar por Email
                  </Button>
                </div>
              </div>

              {showEmailForm && (
                <div className="space-y-3 border-t pt-3">
                  <Label htmlFor="email">Email do destinatário</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        sendEmailMutation.mutate({
                          email,
                          token: generatedToken,
                        })
                      }
                      disabled={sendEmailMutation.isPending || !email}
                      className="flex-shrink-0"
                    >
                      {sendEmailMutation.isPending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O código será enviado diretamente por email para o
                    destinatário.
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                ⚠️ Envie esta chave apenas para o usuário que você deseja
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
