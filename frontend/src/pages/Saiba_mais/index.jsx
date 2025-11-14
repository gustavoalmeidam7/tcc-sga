import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  MessageSquare,
  Route,
  Users,
  Ambulance,
  Hospital,
  Building,
  CheckCircle,
  UserPlus,
  Bell,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/Logo.webp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full text-center hover:border-primary hover:shadow-lg transition-all">
      <CardHeader className="items-center">
        <div className="p-3 bg-primary/10 rounded-full mb-2">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const TargetAudienceCard = ({ icon: Icon, title }) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="font-semibold text-foreground">{title}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function SaibaMais() {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description:
        "Agende transportes de pacientes de forma programada, evitando conflitos e otimizando o uso da frota.",
    },
    {
      icon: Route,
      title: "Otimização de Rotas",
      description:
        "Nossa tecnologia calcula a rota mais eficiente, economizando tempo e combustível.",
    },
    {
      icon: MessageSquare,
      title: "Comunicação em Tempo Real",
      description:
        "Acompanhe o status da viagem e comunique-se facilmente com a central e os motoristas.",
    },
    {
      icon: Users,
      title: "Gestão de Motoristas",
      description:
        "Gerencie sua equipe, atribua viagens e monitore a disponibilidade de cada motorista.",
    },
    {
      icon: Ambulance,
      title: "Controle de Frota",
      description:
        "Tenha uma visão completa das suas ambulâncias, status de manutenção e alocação.",
    },
    {
      icon: BarChart3,
      title: "Relatórios e Análises",
      description:
        "Extraia relatórios detalhados para tomar decisões mais inteligentes e melhorar sua operação.",
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-background to-muted/50"
      >
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-color-primary-foreground)_0%,_transparent_40%)] opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <motion.img
            src={logo}
            alt="SGA - Sistema de Gestão de Ambulâncias"
            className="h-64 md:h-80 lg:h-96 mx-auto md:mx-0 drop-shadow-2xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Inovação e Eficiência na Gestão de Ambulâncias
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
              O SGA é a solução completa para otimizar o agendamento, o
              roteamento e o gerenciamento de transportes de pacientes.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="max-w-5xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">O que é o SGA?</h2>
          <p className="text-muted-foreground mt-2">
            Uma plataforma centralizada para revolucionar o transporte de
            pacientes.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="p-6 md:p-8 bg-muted/30">
            <p className="text-base md:text-lg text-center text-foreground leading-relaxed">
              O Sistema de Gestão de Ambulâncias (SGA) foi projetado para
              resolver os desafios logísticos do transporte de pacientes não
              emergenciais. Nossa plataforma conecta pacientes, motoristas e
              gestores de frota em um ecossistema coeso, garantindo que cada
              viagem seja planejada e executada com a máxima eficiência,
              segurança e pontualidade. Desde o agendamento inicial até a
              conclusão da viagem, o SGA oferece as ferramentas necessárias para
              uma gestão completa e transparente.
            </p>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section
        className="max-w-7xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">
            Como Utilizar o Sistema
          </h2>
          <p className="text-muted-foreground mt-2">
            Um guia simples para começar a usar o SGA.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="h-full text-center hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>1. Crie sua Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Faça seu cadastro de forma rápida e segura para ter acesso a
                  todas as funcionalidades.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="h-full text-center hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>2. Solicite uma Viagem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Informe os endereços de origem e destino, e os dados do
                  paciente para agendar o transporte.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="h-full text-center hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>3. Confirme o Agendamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Revise todos os detalhes da viagem e confirme. Sua solicitação
                  será enviada para a central.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="h-full text-center hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>4. Acompanhe em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Monitore o status da sua viagem e receba notificações
                  importantes sobre o andamento.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="max-w-7xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Nossos Recursos</h2>
          <p className="text-muted-foreground mt-2">
            Ferramentas poderosas para uma gestão sem complicações.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="max-w-5xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">
            Para Quem é o SGA?
          </h2>
          <p className="text-muted-foreground mt-2">
            Ideal para diversas instituições da área da saúde.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <TargetAudienceCard icon={Hospital} title="Hospitais e Clínicas" />
          <TargetAudienceCard
            icon={Ambulance}
            title="Empresas de Transporte de Pacientes"
          />
          <TargetAudienceCard icon={Building} title="Operadoras de Saúde" />
        </div>
      </motion.section>

      <motion.section
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Transformar sua Gestão?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Cadastre-se agora e descubra como o SGA pode levar sua operação de
              transporte de pacientes para o próximo nível.
            </p>
            <Link to="/registro">
              <Button
                size="lg"
                variant="secondary"
                className="text-base font-bold text-foreground bg-background hover:bg-foreground hover:text-background group"
              >
                Comece Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
