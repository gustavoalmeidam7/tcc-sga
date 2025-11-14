import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  MapPin,
  Clock,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Phone,
  LifeBuoy,
  Zap,
  Target,
  Heart,
  Calendar,
  PlayCircle,
  Code,
} from "lucide-react";
import { SiReact, SiPython, SiPostgresql } from "react-icons/si";
import Home from "@/pages/Home";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  if (isAuthenticated) {
    return <Home />;
  }

  const features = [
    {
      icon: MapPin,
      title: "Roteamento Inteligente",
      description:
        "Cálculo automático de rotas otimizadas para transporte de pacientes",
      badge: "IA",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      icon: Clock,
      title: "Agendamento Programado",
      description:
        "Sistema completo para agendar e gerenciar transportes com antecedência",
      badge: "Novo",
      color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    },
    {
      icon: Shield,
      title: "Segurança e Confiabilidade",
      description: "Proteção de dados e informações sigilosas dos pacientes",
      badge: "LGPD",
      color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    },
    {
      icon: Users,
      title: "Gestão Completa",
      description:
        "Controle de motoristas, ambulâncias e viagens em um só lugar",
      badge: "Pro",
      color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    },
    {
      icon: BarChart3,
      title: "Relatórios e Histórico",
      description:
        "Acompanhe todas as viagens realizadas e gere relatórios detalhados",
      badge: "Analytics",
      color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    },
    {
      icon: Car,
      title: "Frota Gerenciada",
      description:
        "Controle completo sobre a disponibilidade e status das ambulâncias",
      badge: "Real-time",
      color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    },
  ];

  const benefits = [
    "Agendamento rápido e fácil",
    "Roteamento otimizado automático",
    "Histórico completo de viagens",
    "Interface intuitiva e moderna",
    "Suporte dedicado",
    "Sistema seguro e confiável",
  ];

  const technologies = [
    {
      name: "React",
      description:
        "Biblioteca JavaScript moderna para construção de interfaces de usuário. Utilizada para criar componentes reutilizáveis e uma experiência de usuário fluida e interativa.",
      icon: SiReact,
      iconColor: "text-[#61DAFB]",
    },
    {
      name: "Python",
      description:
        "Linguagem de programação de alto nível utilizada no backend. Oferece sintaxe clara, vasta biblioteca padrão e é ideal para desenvolvimento rápido e manutenção facilitada.",
      icon: SiPython,
      iconColor: "text-[#3776AB]",
    },
    {
      name: "PostgreSQL",
      description:
        "Sistema de gerenciamento de banco de dados relacional de código aberto. Garante integridade dos dados, suporte a transações ACID e excelente performance para aplicações críticas.",
      icon: SiPostgresql,
      iconColor: "text-[#4169E1]",
    },
    {
      name: "React Native",
      description:
        "Framework para desenvolvimento de aplicações mobile nativas usando React. Permite criar apps iOS e Android com código compartilhado, mantendo performance nativa.",
      icon: SiReact,
      iconColor: "text-[#61DAFB]",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Crie sua Conta",
      description: "Cadastre-se gratuitamente no sistema SGA",
      icon: Users,
    },
    {
      number: "02",
      title: "Agende uma Viagem",
      description: "Preencha os dados do paciente e destino",
      icon: Calendar,
    },
    {
      number: "03",
      title: "Acompanhe em Tempo Real",
      description: "Monitore o status da viagem em tempo real",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            >
              Sistema de Gestão de{" "}
              <motion.span
                className="text-primary inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Ambulâncias
              </motion.span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gerencie transportes de pacientes de forma eficiente, segura e
              organizada. Agendamentos programados com roteamento inteligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/registro">
                <Button size="lg" className="text-lg px-8 py-6">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/saiba-mais">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-primary text-lg px-8 py-6"
                >
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Recursos Avançados
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos Principais
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar transportes de pacientes de
              forma profissional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${
                      hoveredFeature === index
                        ? "border-primary/50 shadow-xl scale-105"
                        : "border-transparent"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                        >
                          <feature.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <Badge
                          variant="outline"
                          className={`${feature.color} border`}
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="benefits" className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-5">
              <TabsList className="inline-flex items-center w-auto gap-2 bg-muted/40 h-12 px-3 rounded-2xl border border-border/50 shadow-sm">
                <TabsTrigger
                  value="benefits"
                  className="cursor-pointer h-9 px-4 text-sm rounded-lg data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-md data-[state=inactive]:!bg-transparent data-[state=inactive]:!text-muted-foreground data-[state=inactive]:hover:!bg-muted/60 data-[state=inactive]:hover:!text-foreground transition-all duration-200"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Benefícios
                </TabsTrigger>
                <TabsTrigger
                  value="tech"
                  className="cursor-pointer h-9 px-4 text-sm rounded-lg data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-md data-[state=inactive]:!bg-transparent data-[state=inactive]:!text-muted-foreground data-[state=inactive]:hover:!bg-muted/60 data-[state=inactive]:hover:!text-foreground transition-all duration-200"
                >
                  <Code className="mr-2 h-3.5 w-3.5" />
                  Tecnologias
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="benefits" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Por que escolher o SGA?
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-8">
                    Um sistema completo desenvolvido para facilitar o
                    gerenciamento de transportes de pacientes, com foco em
                    eficiência e segurança.
                  </p>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <Card className="p-8 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Heart className="h-6 w-6 text-primary" />
                        Pronto para começar?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          Crie sua conta gratuitamente e comece a gerenciar seus
                          transportes hoje mesmo.
                        </p>
                        <Separator />
                        <div className="flex flex-col gap-3">
                          <Link to="/registro">
                            <Button size="lg" className="w-full">
                              Criar Conta Gratuita
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                          <Link to="/login">
                            <Button
                              size="lg"
                              variant="outline"
                              className="w-full"
                            >
                              Já tenho uma conta
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Tecnologias Modernas
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Stack tecnológico escolhido para garantir performance,
                  escalabilidade e manutenibilidade do sistema
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/40 bg-card/80 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <tech.icon
                                className={`w-full h-full ${
                                  tech.iconColor || "text-primary"
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {tech.name}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                Stack
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {tech.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <PlayCircle className="mr-1 h-3 w-3" />
              Como Funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simples e Rápido
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em apenas 3 passos você começa a usar o sistema
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative h-full flex"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent -z-10">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex"
                >
                  <Card className="h-full w-full text-center hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 bg-card/50">
                    <CardContent className="p-8 flex flex-col">
                      <div className="flex justify-center mb-4">
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <step.icon className="h-8 w-8 text-primary" />
                          </motion.div>
                          <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center p-0 text-xs"
                          >
                            {step.number}
                          </Badge>
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground flex-1">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Precisa de ajuda?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe está pronta para ajudar você. Entre em contato ou
              acesse nossa central de suporte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/suporte">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <LifeBuoy className="mr-2 h-5 w-5" />
                  Central de Suporte
                </Button>
              </Link>
              <a href="tel:1633334444">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  (16) 3333-4444
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
