import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Info } from "lucide-react";

export default function Termos() {
  return (
    <main className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-5 pb-6 pt-5">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-6 border border-primary/20"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Termos e Condições
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Políticas de uso e privacidade
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                1. Aceitação dos Termos
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Ao acessar e utilizar o sistema SGA (Sistema de Gerenciamento de
                Ambulâncias), você concorda em cumprir e estar vinculado aos
                seguintes termos e condições de uso. Se você não concorda com
                alguma parte destes termos, não deve utilizar o sistema.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                2. Descrição do Serviço
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                O SGA é uma plataforma desenvolvida para gerenciar e coordenar
                serviços de transporte em ambulâncias, permitindo que
                motoristas, gestores e outros usuários autorizados gerenciem
                viagens, ambulâncias e informações relacionadas ao serviço.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                3. Uso do Sistema
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Você concorda em utilizar o sistema apenas para fins legais e de
                acordo com estes termos. É proibido utilizar o sistema de forma
                que possa danificar, desabilitar, sobrecarregar ou comprometer
                nossos servidores ou redes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                4. Conta de Usuário
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Para utilizar determinadas funcionalidades do sistema, você
                precisará criar uma conta. Você é responsável por manter a
                confidencialidade de suas credenciais de acesso e por todas as
                atividades que ocorram sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                5. Privacidade e Proteção de Dados
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Respeitamos sua privacidade e nos comprometemos a proteger seus
                dados pessoais. As informações coletadas são utilizadas
                exclusivamente para fornecer e melhorar nossos serviços, em
                conformidade com a legislação vigente sobre proteção de dados,
                incluindo a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                6. Responsabilidades do Usuário
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Você é responsável por fornecer informações precisas e
                atualizadas. Não deve compartilhar sua conta com terceiros ou
                utilizar o sistema para atividades fraudulentas ou ilegais. É de
                sua responsabilidade notificar-nos imediatamente sobre qualquer
                uso não autorizado de sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                7. Limitação de Responsabilidade
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                O sistema é fornecido "como está", sem garantias de qualquer
                tipo. Não nos responsabilizamos por danos diretos, indiretos,
                incidentais ou consequenciais resultantes do uso ou incapacidade
                de usar o sistema. Este sistema é destinado exclusivamente para
                agendamentos programados e não deve ser utilizado para
                emergências médicas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                8. Modificações nos Termos
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Reservamos o direito de modificar estes termos a qualquer
                momento. As alterações entrarão em vigor imediatamente após a
                publicação. O uso continuado do sistema após as alterações
                constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                9. Propriedade Intelectual
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Todo o conteúdo do sistema, incluindo textos, gráficos, logos,
                ícones e software, é propriedade do SGA ou de seus licenciadores
                e está protegido por leis de direitos autorais e outras leis de
                propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                10. Rescisão
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Reservamos o direito de suspender ou encerrar sua conta e acesso
                ao sistema, a nosso critério, sem aviso prévio, por violação
                destes termos ou por qualquer outro motivo que consideremos
                apropriado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                11. Lei Aplicável
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Estes termos são regidos pelas leis brasileiras. Qualquer
                disputa relacionada a estes termos será resolvida nos tribunais
                competentes do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                12. Contato
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Se você tiver dúvidas sobre estes termos, entre em contato
                conosco através dos canais de suporte disponíveis no sistema ou
                através do e-mail sga.suporte.br@gmail.com.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Importante</h3>
              <p className="text-sm text-muted-foreground leading-5">
                Ao utilizar este sistema, você confirma que leu, compreendeu e
                concorda com todos os termos e condições aqui apresentados.
                Recomendamos que você revise estes termos periodicamente para
                estar ciente de quaisquer alterações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
