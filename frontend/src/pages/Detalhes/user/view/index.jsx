import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import authService from "@/services/authService";
import { getTravels } from "@/services/travelService";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Briefcase,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatarData } from "@/lib/date-utils";
import { TravelStatus } from "@/lib/travel-status";
import { UserHeader } from "../components/UserHeader";
import { UserInfoCard } from "../components/UserInfoCard";
import { StatsCard } from "../components/UserStats";
import { UserDetailsSkeleton } from "@/components/ui/user-details-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsView() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    data: usuario,
    isLoading: loadingUser,
    error,
  } = useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => authService.getUserById(userId),
    staleTime: 1000 * 60 * 5,
  });

  const { data: todasViagens = [], isLoading: loadingViagens } = useQuery({
    queryKey: ["travels"],
    queryFn: getTravels,
    staleTime: 1000 * 60 * 5,
  });

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

  if (loadingUser) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <UserDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-destructive">
            Erro ao carregar usuário
          </h2>
          <p className="text-muted-foreground">
            {error.response?.data?.detail ||
              "Não foi possível carregar as informações do usuário."}
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Voltar
        </Button>
      </div>
    );
  }

  const dataNascimento = usuario?.nascimento
    ? formatarData(usuario.nascimento)
    : "Não informado";

  const idade = usuario?.nascimento
    ? new Date().getFullYear() - new Date(usuario.nascimento).getFullYear()
    : null;

  const viagensDoUsuario = todasViagens.filter(
    (v) => v.id_paciente === usuario?.id || v.id_motorista === usuario?.id
  );

  const stats = {
    pendentes: viagensDoUsuario.filter(
      (v) => v.realizado === TravelStatus.NAO_REALIZADO
    ).length,
    concluidas: viagensDoUsuario.filter(
      (v) => v.realizado === TravelStatus.REALIZADO
    ).length,
    total: viagensDoUsuario.length,
  };

  const infoPessoais = [
    {
      icon: User,
      label: "Nome Completo",
      value: usuario?.nome,
      iconColor: "text-blue-500",
    },
    {
      icon: Calendar,
      label: "Data de Nascimento",
      value: dataNascimento,
      iconColor: "text-green-500",
    },
    {
      icon: CreditCard,
      label: "CPF",
      value: usuario?.cpf,
      iconColor: "text-purple-500",
    },
  ];

  const infoContato = [
    {
      icon: Mail,
      label: "E-mail",
      value: usuario?.email,
      iconColor: "text-orange-500",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: usuario?.telefone,
      iconColor: "text-cyan-500",
    },
    {
      icon: Briefcase,
      label: "Cargo no Sistema",
      value:
        usuario?.cargo === 0
          ? "Usuário"
          : usuario?.cargo === 1
          ? "Motorista"
          : "Gerente",
      iconColor:
        usuario?.cargo === 0
          ? "text-blue-500"
          : usuario?.cargo === 1
          ? "text-green-500"
          : "text-purple-500",
    },
  ];

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Detalhes do Usuário
          </h1>
        </div>
      </motion.div>

      <UserHeader usuario={usuario} idade={idade} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div variants={item}>
          <UserInfoCard
            title="Informações Pessoais"
            icon={User}
            items={infoPessoais}
          />
        </motion.div>

        <motion.div variants={item}>
          <UserInfoCard
            title="Informações de Contato"
            icon={Phone}
            items={infoContato}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              Estatísticas de Viagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingViagens ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatsCard
                    icon={Clock}
                    label="Viagens Pendentes"
                    value={stats.pendentes}
                    color="blue-500"
                  />
                  <StatsCard
                    icon={CheckCircle2}
                    label="Viagens Concluídas"
                    value={stats.concluidas}
                    color="green-500"
                  />
                  <StatsCard
                    icon={MapPin}
                    label="Total de Viagens"
                    value={stats.total}
                    color="purple-500"
                  />
                </div>
                {stats.total === 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Nenhuma viagem registrada para este usuário
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
