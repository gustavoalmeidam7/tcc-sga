import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Suporte() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso!", {
        description: "Entraremos em contato em breve.",
        duration: 5000,
      });
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
      setEnviando(false);
    }, 1500);
  };

  const faqs = [
    {
      pergunta: "Como solicitar uma viagem de ambulância?",
      resposta:
        "Acesse a página 'Viagens', preencha os dados de origem, destino e informações do paciente. O sistema calculará automaticamente a rota e você poderá confirmar o agendamento.",
    },
    {
      pergunta: "Qual o prazo para agendar uma viagem?",
      resposta:
        "Recomendamos agendar suas viagens com pelo menos 3 dias útil de antecedência. Este sistema é voltado para agendamentos programados de transporte de pacientes.",
    },
    {
      pergunta: "Como posso cancelar uma viagem agendada?",
      resposta:
        "Acesse 'Meus Agendamentos', localize a viagem que deseja cancelar entre nos detalhes dela e clique no botão de exclusão. Lembre-se de fazer isso com antecedência para não prejudicar o planejamento.",
    },
    {
      pergunta: "Posso editar informações do meu perfil?",
      resposta:
        "Sim! Acesse 'Meu Perfil' e clique no botão 'Editar'. Você pode alterar seu nome, email e telefone. A data de nascimento não pode ser alterada.",
    },
    {
      pergunta: "Como acompanhar o status da minha viagem?",
      resposta:
        "Na página 'Meus Agendamentos' você pode ver o status de todas as suas viagens: Pendente, Confirmada ou Finalizada.",
    },
    {
      pergunta: "Este sistema atende emergências?",
      resposta:
        "Não. Este sistema é exclusivo para agendamento de transporte programado de pacientes. Em casos de emergência médica, ligue 192 (SAMU).",
    },
  ];

  return (
    <main className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            💬 Suporte
          </h1>
          <p className="text-sm text-muted-foreground">
            Estamos aqui para ajudar você
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Encontre respostas rápidas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.pergunta}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.resposta}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Canais de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    (16) 3333-4444
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seg a Sex: 8h às 18h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    suporte@sga.com.br
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resposta em até 24h úteis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    Rua São Carlos, 123
                    <br />
                    Centro - São Carlos/SP
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-500">
                    Horário de Atendimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta: 8h às 18h
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Agendamentos programados apenas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    Importante
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Para emergências médicas, ligue <strong>192 (SAMU)</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este sistema é apenas para transporte programado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Envie sua Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Nome Completo
                  </label>
                  <Input
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Assunto
                  </label>
                  <Input
                    placeholder="Sobre o que você precisa de ajuda?"
                    value={formData.assunto}
                    onChange={(e) =>
                      setFormData({ ...formData, assunto: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Mensagem
                  </label>
                  <Textarea
                    placeholder="Descreva sua dúvida ou problema..."
                    rows={6}
                    value={formData.mensagem}
                    onChange={(e) =>
                      setFormData({ ...formData, mensagem: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={enviando}>
                  {enviando ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-green-600 dark:text-green-400">
                      Compromisso com você
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Respondemos todas as mensagens em até 24 horas úteis. Sua
                      satisfação é nossa prioridade!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
