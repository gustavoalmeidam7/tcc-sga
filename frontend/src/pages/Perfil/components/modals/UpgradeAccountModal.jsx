import { useState, useEffect } from "react";
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
import { upgradeAccount, getUpgradeTokenInfo } from "@/services/managerService";
import { showErrorToast, showSuccessToast } from "@/lib/error-utils";
import { Crown, Loader2, Truck, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motoristaSchema } from "@/lib/validations/validations";

export function UpgradeAccountModal({ open, onOpenChange }) {
  const [token, setToken] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [driverFields, setDriverFields] = useState({
    cnh: "",
    vencimento: "",
    id_ambulancia: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { refreshUser } = useAuth();

  const isDriverToken = tokenInfo?.fator_cargo === 1;
  const isManagerToken = tokenInfo?.fator_cargo === 2;

  const formatCNH = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 11);
  };

  const generateUUID = () => {
    return crypto.randomUUID();
  };

  const handleGenerateAmbulanciaId = () => {
    const uuid = generateUUID();
    setDriverFields({ ...driverFields, id_ambulancia: uuid });
    setFieldErrors({ ...fieldErrors, id_ambulancia: undefined });
  };

  const handleCNHChange = (e) => {
    const formatted = formatCNH(e.target.value);
    setDriverFields({ ...driverFields, cnh: formatted });
    setFieldErrors({ ...fieldErrors, cnh: undefined });
  };

  const handleVencimentoChange = (e) => {
    setDriverFields({ ...driverFields, vencimento: e.target.value });
    setFieldErrors({ ...fieldErrors, vencimento: undefined });
  };

  const handleAmbulanciaChange = (e) => {
    setDriverFields({ ...driverFields, id_ambulancia: e.target.value });
    setFieldErrors({ ...fieldErrors, id_ambulancia: undefined });
  };

  const checkTokenMutation = useMutation({
    mutationFn: getUpgradeTokenInfo,
    onSuccess: (data) => {
      setTokenInfo(data);
    },
    onError: (error) => {
      showErrorToast(error, "Chave inválido", {
        defaultMessage:
          "Não foi possível validar a chave. Verifique e tente novamente.",
      });
      setTokenInfo(null);
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: ({ token, driverFields }) =>
      upgradeAccount(token, driverFields),
    onSuccess: async () => {
      const roleLabel = isDriverToken ? "motorista" : "gerente";
      showSuccessToast("Conta atualizada!", {
        description: `Você agora é ${roleLabel} do sistema. Recarregando...`,
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
          "chave inválida ou já utilizada. Verifique e tente novamente.",
      });
    },
  });

  const handleTokenBlur = () => {
    if (token.trim() && !tokenInfo) {
      checkTokenMutation.mutate(token.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!token.trim()) {
      showErrorToast({ message: "chave vazio" }, "chave obrigatório", {
        defaultMessage: "Por favor, insira um chave de acesso.",
      });
      return;
    }

    if (isDriverToken) {
      const validation = motoristaSchema.safeParse(driverFields);

      if (!validation.success) {
        const errors = {};
        validation.error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFieldErrors(errors);

        showErrorToast(
          { message: "Validação falhou" },
          "Preencha todos os campos corretamente",
          {
            defaultMessage:
              "Verifique os campos obrigatórios e tente novamente.",
          }
        );
        return;
      }
    }

    upgradeMutation.mutate({
      token: token.trim(),
      driverFields: isDriverToken ? driverFields : null,
    });
  };

  const handleClose = () => {
    if (!upgradeMutation.isPending && !checkTokenMutation.isPending) {
      setToken("");
      setTokenInfo(null);
      setDriverFields({ cnh: "", vencimento: "", id_ambulancia: "" });
      setFieldErrors({});
      onOpenChange(false);
    }
  };

  const titleIcon = isDriverToken ? (
    <Truck className="h-5 w-5 text-green-500" />
  ) : (
    <Crown className="h-5 w-5 text-yellow-500" />
  );
  const titleText = isDriverToken
    ? "Tornar-se Motorista"
    : isManagerToken
    ? "Tornar-se Gerente"
    : "Fazer Upgrade";
  const description = isDriverToken
    ? "Insira a chave de acesso e preencha os dados necessários para se tornar motorista."
    : isManagerToken
    ? "Insira o a chave de acesso para se tornar gerente do sistema."
    : "Insira a chave de acesso fornecido.";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {titleIcon}
            {titleText}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upgrade-token" className="text-foreground">
              Chave de Acesso
            </Label>
            <Input
              id="upgrade-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onBlur={handleTokenBlur}
              placeholder="Coloque a chave de acesso aqui"
              className="font-mono"
              disabled={
                upgradeMutation.isPending || checkTokenMutation.isPending
              }
              autoFocus
            />
            {checkTokenMutation.isPending && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Validando Chave...
              </p>
            )}
            {!checkTokenMutation.isPending && !tokenInfo && token && (
              <p className="text-xs text-muted-foreground">
                Cole a chave de acesso e clique fora do campo para validá-lo.
              </p>
            )}
          </div>

          {isDriverToken && (
            <div className="space-y-3 p-3 border rounded-md bg-muted/30">
              <p className="text-sm font-medium">Dados do Motorista</p>

              <div className="space-y-2">
                <Label htmlFor="cnh">CNH *</Label>
                <Input
                  id="cnh"
                  value={driverFields.cnh}
                  onChange={handleCNHChange}
                  placeholder="00000000000"
                  maxLength={11}
                  disabled={upgradeMutation.isPending}
                  className={fieldErrors.cnh ? "border-destructive" : ""}
                />
                {fieldErrors.cnh && (
                  <p className="text-xs text-destructive">{fieldErrors.cnh}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Digite apenas números (11 dígitos)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vencimento">Vencimento da CNH *</Label>
                <Input
                  id="vencimento"
                  type="date"
                  value={driverFields.vencimento}
                  onChange={handleVencimentoChange}
                  disabled={upgradeMutation.isPending}
                  className={fieldErrors.vencimento ? "border-destructive" : ""}
                  min={new Date().toISOString().split("T")[0]}
                />
                {fieldErrors.vencimento && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.vencimento}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  A CNH não pode estar vencida
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambulancia">ID da Ambulância *</Label>
                <div className="flex gap-2">
                  <Input
                    id="ambulancia"
                    value={driverFields.id_ambulancia}
                    onChange={handleAmbulanciaChange}
                    placeholder="ID da ambulância"
                    disabled={upgradeMutation.isPending}
                    className={
                      fieldErrors.id_ambulancia ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGenerateAmbulanciaId}
                    disabled={upgradeMutation.isPending}
                    title="Gerar UUID"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                {fieldErrors.id_ambulancia && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.id_ambulancia}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Clique no botão para gerar um UUID automaticamente
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={
                upgradeMutation.isPending || checkTokenMutation.isPending
              }
              className="m-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                upgradeMutation.isPending ||
                checkTokenMutation.isPending ||
                !token.trim() ||
                !tokenInfo
              }
              className="m-1"
            >
              {upgradeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isDriverToken ? (
                    <Truck className="h-4 w-4 mr-2" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
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
