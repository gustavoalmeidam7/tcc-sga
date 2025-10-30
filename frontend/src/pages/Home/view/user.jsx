import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TextAnimate } from "@/components/ui/text-animate";
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  MapPinned,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserDashboard } from "../hooks/staticUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { dashboardData, loading } = useUserDashboard();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          delay={0.15}
          accessible={false}
          className="text-xl md:text-2xl font-bold text-foreground"
        >
          {`Bem-vindo, ${user?.nome || ""}!`}
        </TextAnimate>
        <p className="text-muted-foreground">
          Acompanhe suas viagens e solicite novos agendamentos
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              <motion.div variants={item}>
                <Card className="hover:border-blue-500 transition-all">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Pendentes
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-500">
                          {dashboardData.stats.pendentes}
                        </p>
                      </div>
                      <div className="hidden sm:block p-2 bg-blue-500/10 rounded-full">
                        <Clock className="h-5 w-5 text-blue-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="hover:border-green-500 transition-all">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Concluídas
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-500">
                          {dashboardData.stats.concluidas}
                        </p>
                      </div>
                      <div className="hidden sm:block p-2 bg-green-500/10 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="hover:border-purple-500 transition-all">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Total
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-500">
                          {dashboardData.stats.total}
                        </p>
                      </div>
                      <div className="hidden sm:block p-2 bg-purple-500/10 rounded-full">
                        <TrendingUp className="h-5 w-5 text-purple-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <Card
                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
                onClick={() => navigate("/viagens")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Nova Viagem
                    </span>
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Solicite uma nova viagem de ambulância
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Preencha origem, destino e dados do paciente
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
                onClick={() => navigate("/agendamentos")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Meus Agendamentos
                    </span>
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie suas viagens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Você tem{" "}
                    <strong className="text-primary">
                      {dashboardData.stats.pendentes}
                    </strong>{" "}
                    {dashboardData.stats.pendentes === 1
                      ? "viagem pendente"
                      : "viagens pendentes"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Próximas Viagens
                </CardTitle>
                <CardDescription>
                  Suas viagens agendadas para os próximos dias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.proximasViagens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Você ainda não tem viagens agendadas.</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => navigate("/viagens")}
                    >
                      Agendar primeira viagem
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {dashboardData.proximasViagens.map((viagem, index) => (
                      <motion.div
                        key={viagem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:border-primary transition-all cursor-pointer"
                        onClick={() => navigate("/agendamentos")}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {viagem.dataHoraCompleta}
                            </span>
                          </div>
                          <Badge
                            variant={
                              viagem.status === "confirmada"
                                ? "default"
                                : viagem.status === "pendente"
                                ? "secondary"
                                : viagem.status === "finalizada"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {viagem.status.charAt(0).toUpperCase() +
                              viagem.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPinned className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Origem</p>
                              <p className="text-muted-foreground">
                                {viagem.origem}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Destino</p>
                              <p className="text-muted-foreground">
                                {viagem.destino}
                              </p>
                            </div>
                          </div>

                          {viagem.paciente && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-muted-foreground">
                                Paciente: <strong>{viagem.paciente}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/agendamentos")}
                    >
                      Ver Todos os Agendamentos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Dica importante</p>
              <p className="text-xs text-muted-foreground">
                Lembre-se de agendar suas viagens com pelo menos 1 dia útil de
                antecedência. Em caso de emergência, entre em contato
                diretamente com nossa central.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
