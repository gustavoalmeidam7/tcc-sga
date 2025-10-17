import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";

export function useDeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authService.deleteUser();

      toast.error('Conta deletada com sucesso', {
        description: 'Sua conta foi removida permanentemente.',
        duration: 3000,
      });

      logout();
      navigate('/');
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      const erros = err.response?.data?.Erros || [];
      const mensagemErro = erros.length > 0
        ? Object.values(erros[0])[0]
        : "Erro ao deletar conta. Tente novamente.";

      toast.error('Erro ao deletar conta', {
        description: mensagemErro,
        duration: 5000,
      });

      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
}
