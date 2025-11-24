import { useNavigate, useLocation, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import img_logo from "@/assets/Logo.webp";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validations/validations";

export default function Login({ className, ...props }) {
  const {
    login,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  async function onSubmit(values) {
    if (authError) clearError();

    try {
      await login(values.email, values.senha);
      toast.success("Login realizado com sucesso!", {
        description: "Redirecionando para o sistema...",
        duration: 3000,
      });
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.Erros?.[0] ||
        err.response?.data?.detail ||
        err.message ||
        "Erro ao fazer login. Verifique suas credenciais.";

      toast.error("Erro no login", {
        description: errorMessage,
        duration: 5000,
      });
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div
          className={cn("flex flex-col gap-6 max-w-4xl mx-auto", className)}
          {...props}
        >
          <Card className="overflow-hidden">
            <CardContent className="grid md:grid-cols-2">
              <div className="p-10 md:p-12">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold text-foreground">
                        Bem Vindo de Volta
                      </h1>
                      <p className="text-muted-foreground text-balance">
                        Realize login com sua conta SGA
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="m@example.com"
                              autoComplete="email"
                              aria-label="Endereço de email"
                              aria-required="true"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <div className="flex items-center">
                            <FormLabel className="text-foreground">
                              Senha
                            </FormLabel>
                            <Link
                              to="/rec_senha"
                              className="ml-auto text-sm underline-offset-2 hover:underline"
                            >
                              Esqueceu sua senha?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="current-password"
                              aria-label="Senha"
                              aria-required="true"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={authLoading}
                      aria-label={
                        authLoading ? "Entrando no sistema" : "Realizar login"
                      }
                    >
                      {authLoading ? (
                        <>
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          Entrando...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Não possui conta?
                      </span>
                    </div>

                    <div className="text-center text-sm">
                      Venha fazer parte?{" "}
                      <Link
                        to="/registro"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Cadastre-se
                      </Link>
                    </div>

                    <div className="text-center text-xs text-muted-foreground pt-2">
                      Ao entrar, você concorda com nossos{" "}
                      <Link
                        to="/termos"
                        className="underline underline-offset-2 hover:text-primary font-medium"
                      >
                        Termos de Uso
                      </Link>
                    </div>
                  </form>
                </Form>
              </div>

              <div className="bg-muted relative hidden md:block">
                <img
                  src={img_logo}
                  alt="Imagem de Login"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
