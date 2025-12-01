import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Mail,
  ArrowLeft,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import authService from "@/services/authService";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

const codeSchema = z
  .object({
    code: z.string().min(1, "Código é obrigatório"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function Rec_senha() {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step") || "email";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const handleSendEmail = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.sendRestorePassword(values.email);
      setUserEmail(values.email);
      setEmailSent(true);
      const successMessage =
        response?.userMessage || "Email enviado com sucesso!";
      toast.success("Sucesso!", {
        description: successMessage,
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/rec_senha?step=code");
        setEmailSent(false);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensagem ||
        error.response?.data?.userMessage ||
        "Erro ao enviar email";
      toast.error("Erro ao enviar email", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.restorePassword(
        values.code,
        values.password
      );
      const userName = response?.nome || "Usuário";
      toast.success("Senha alterada com sucesso!", {
        description: `Bem-vindo de volta, ${userName}! Você será redirecionado para o login.`,
        duration: 5000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.mensagem ||
        error.response?.data?.userMessage ||
        "Erro ao alterar senha";
      toast.error("Erro ao alterar senha", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-2 sm:p-4">
      <div className="w-full max-w-6xl">
        <div
          className={`grid lg:grid-cols-2 gap-6 items-center ${
            step === "code" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          <div
            className={`w-full ${
              step === "code" ? "lg:order-1" : "lg:order-1"
            }`}
          >
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-form"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.4 },
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8"
                >
                  <div className="relative w-full max-w-full sm:max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl blur-3xl animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-card via-card/95 to-muted/20 backdrop-blur-md border-2 border-primary/20 rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
                      <Form {...emailForm}>
                        <form
                          onSubmit={emailForm.handleSubmit(handleSendEmail)}
                          className="space-y-6"
                        >
                          <div className="space-y-3 text-center mb-8">
                            <div className="flex justify-center mb-4">
                              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                                <Mail className="h-10 w-10 text-primary" />
                              </div>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                              Recuperar Senha
                            </h1>
                            <p className="text-sm text-muted-foreground">
                              Digite seu email cadastrado e enviaremos um código
                              de recuperação
                            </p>
                          </div>

                          <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                    className="h-12 text-base"
                                    disabled={isLoading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-sm" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isLoading || emailSent}
                            size="lg"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Enviando...
                              </>
                            ) : emailSent ? (
                              <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Email Enviado!
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-5 w-5" />
                                Enviar Código de Recuperação
                              </>
                            )}
                          </Button>

                          <div className="pt-4 border-t border-primary/10">
                            <Link
                              to="/login"
                              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                              Voltar para o login
                            </Link>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="info-card"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.4 },
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8"
                >
                  <div className="relative w-full max-w-full sm:max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl blur-3xl animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-card via-card/95 to-muted/20 backdrop-blur-md border-2 border-primary/20 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                      <div className="space-y-5">
                        <div className="flex flex-col items-center space-y-2 text-center">
                          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                            <Mail className="h-10 w-10 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                              Email Enviado!
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Verifique sua caixa de entrada
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold mb-1">
                                Email enviado para:
                              </p>
                              <p className="text-sm text-muted-foreground break-all">
                                {userEmail || "seu@email.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Próximos passos:
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-sm font-bold text-foreground">
                                  1
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                  Abra sua caixa de entrada e procure pelo email
                                  de recuperação
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-sm font-bold text-foreground">
                                  2
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                  Copie o código de recuperação enviado
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-sm font-bold text-foreground">
                                  3
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                  Cole o código no formulário ao lado e defina
                                  sua nova senha
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/10">
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground mb-1">
                                Importante:
                              </p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• O código expira em alguns minutos</li>
                                <li>
                                  • Verifique também a pasta de spam/lixo
                                  eletrônico
                                </li>
                                <li>• Não compartilhe o código com ninguém</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Link
                            to="/rec_senha"
                            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                          >
                            <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            Não recebeu? Solicitar novo código
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`w-full ${
              step === "code" ? "lg:order-2" : "hidden lg:flex lg:order-2"
            }`}
          >
            <AnimatePresence mode="wait">
              {step === "code" ? (
                <motion.div
                  key="code-form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.4 },
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8"
                >
                  <div className="relative w-full max-w-full sm:max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl blur-3xl animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-card via-card/95 to-muted/20 backdrop-blur-md border-2 border-primary/20 rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
                      <Form {...codeForm}>
                        <form
                          onSubmit={codeForm.handleSubmit(handleResetPassword)}
                          className="space-y-6"
                        >
                          <div className="flex flex-col items-center space-y-3 text-center mb-8">
                            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                              <KeyRound className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Nova Senha
                              </h1>
                              <p className="text-sm text-muted-foreground">
                                Digite o código recebido por email e defina sua
                                nova senha
                              </p>
                            </div>
                          </div>

                          <FormField
                            control={codeForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4" />
                                  Código de Recuperação
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Digite o código recebido"
                                    className="h-12 text-base font-mono tracking-wider"
                                    disabled={isLoading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-sm" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={codeForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  Nova Senha
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    autoComplete="new-password"
                                    className="h-12 text-base"
                                    disabled={isLoading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-sm" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={codeForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  Confirmar Nova Senha
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    className="h-12 text-base"
                                    disabled={isLoading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-sm" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isLoading}
                            size="lg"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Alterando senha...
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 h-5 w-5" />
                                Alterar Senha
                              </>
                            )}
                          </Button>

                          <div className="pt-4 border-t border-primary/10">
                            <Link
                              to="/rec_senha"
                              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                              Voltar para solicitar novo código
                            </Link>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="visual-card"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.4 },
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8"
                >
                  <div className="relative w-full max-w-full sm:max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl blur-3xl animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-card via-card/95 to-muted/20 backdrop-blur-md border-2 border-primary/20 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-2 text-center">
                          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                              Sistema de Gestão de Ambulâncias
                            </h2>
                            <p className="text-xs text-muted-foreground">
                              Recuperação de senha segura e confiável
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                            <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-xs mb-0.5">
                                Segurança Total
                              </h3>
                              <p className="text-xs text-muted-foreground leading-tight">
                                Seus dados protegidos com criptografia de ponta
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                            <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                              <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-xs mb-0.5">
                                Processo Rápido
                              </h3>
                              <p className="text-xs text-muted-foreground leading-tight">
                                Receba o código de recuperação em instantes
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                            <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                              <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-xs mb-0.5">
                                Privacidade Garantida
                              </h3>
                              <p className="text-xs text-muted-foreground leading-tight">
                                Seu código é único e expira automaticamente
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/10">
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">
                              <span className="font-semibold text-foreground">
                                Dica:
                              </span>{" "}
                              Verifique sua caixa de spam caso não receba o
                              email
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rec_senha;
