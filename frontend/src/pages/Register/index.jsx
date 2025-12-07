import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  formatCPF,
  formatPhone,
  unmaskCPF,
  unmaskPhone,
} from "@/lib/format-utils";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import img_logo from "@/assets/Logo_Maior.webp";
import { registroSchema } from "@/lib/validations/validations";

export default function Registro({ className, ...props }) {
  const {
    register,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      nascimento: "",
      senha: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    if (authError) clearError();

    try {
      const userData = {
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        cpf: unmaskCPF(values.cpf),
        telefone: unmaskPhone(values.telefone),
        nascimento: values.nascimento,
        senha: values.senha,
      };

      const result = await register(userData);

      if (result?.autoLogin) {
        toast.success("Cadastro realizado com sucesso!", {
          description: "Você será redirecionado para o sistema...",
          duration: 3000,
        });
        setTimeout(() => navigate("/home"), 500);
      } else {
        toast.success("Cadastro realizado com sucesso!", {
          description: "Você será redirecionado para o login.",
          duration: 3000,
        });
        setTimeout(() => navigate("/login"), 500);
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      if (err.message) {
        toast.error("Erro no cadastro", {
          description: err.message,
          duration: 5000,
        });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  return (
    <div className="flex h-full flex-col items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <div
          className={cn("flex flex-col gap-6 max-w-5xl mx-auto", className)}
          {...props}
        >
          <Card className="overflow-hidden">
            <CardContent className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold text-foreground">
                        Crie sua Conta
                      </h1>
                      <p className="text-muted-foreground text-balance">
                        Insira seus dados para se cadastrar na plataforma SGA.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome"
                              autoComplete="name"
                              aria-label="Nome completo"
                              aria-required="true"
                              {...field}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

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
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              inputMode="numeric"
                              aria-label="CPF"
                              aria-required="true"
                              {...field}
                              onChange={(e) =>
                                field.onChange(formatCPF(e.target.value))
                              }
                              maxLength={14}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">
                            Telefone
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(00) 00000-0000"
                              autoComplete="tel"
                              inputMode="tel"
                              aria-label="Telefone"
                              aria-required="true"
                              {...field}
                              onChange={(e) =>
                                field.onChange(formatPhone(e.target.value))
                              }
                              maxLength={15}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nascimento"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">
                            Data de Nascimento
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              autoComplete="bday"
                              aria-label="Data de nascimento"
                              aria-required="true"
                              {...field}
                              max={new Date().toISOString().split("T")[0]}
                              disabled={authLoading}
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
                          <FormLabel className="text-foreground">
                            Senha
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              aria-label="Senha"
                              aria-required="true"
                              minLength={8}
                              {...field}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel className="text-foreground">
                            Confirmar Senha
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              aria-label="Confirmar senha"
                              aria-required="true"
                              {...field}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground" />
                        </FormItem>
                      )}
                    />

                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={authLoading}
                      >
                        {authLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>

                      <div className="text-center text-xs text-muted-foreground pt-2">
                        Ao se cadastrar, você concorda com nossos{" "}
                        <Link
                          to="/termos"
                          className="underline underline-offset-2 hover:text-primary font-medium"
                        >
                          Termos de Uso
                        </Link>
                      </div>

                      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-2">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                          Já Possui Conta?
                        </span>
                      </div>

                      <div className="text-center text-sm mt-1">
                        Faça o login.{" "}
                        <Link
                          to="/login"
                          className="underline underline-offset-4 hover:text-primary"
                        >
                          Login
                        </Link>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>

              <div className="bg-muted relative hidden md:flex items-center justify-center">
                <img src={img_logo} alt="Logo SGA" className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
