import { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Navigation,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCPF } from "@/lib/format-utils";

function DadosPacienteComponent({
  origem,
  destino,
  distancia,
  duracao,
  nomePaciente,
  setNomePaciente,
  cpfPaciente,
  setCpfPaciente,
  estadoSaude,
  setEstadoSaude,
  dataAgendamento,
  setDataAgendamento,
  horaAgendamento,
  setHoraAgendamento,
  observacoes,
  setObservacoes,
  dataMinima,
  error,
  enviando = false,
  onVoltar,
  onConfirmar,
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">
              Resumo da Viagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Origem</p>
                <p className="text-sm font-medium truncate">{origem}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Navigation className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Destino</p>
                <p className="text-sm font-medium truncate">{destino}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-primary">
                  {distancia} km
                </p>
                <p className="text-xs text-muted-foreground">Distância</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-orange-500">
                  {duracao} min
                </p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <User className="h-5 w-5 text-primary" />
              Dados do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomePaciente">Nome Completo *</Label>
              <Input
                id="nomePaciente"
                placeholder="Nome do paciente"
                value={nomePaciente}
                onChange={(e) => setNomePaciente(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfPaciente">CPF *</Label>
              <Input
                id="cpfPaciente"
                placeholder="000.000.000-00"
                value={cpfPaciente}
                onChange={(e) => setCpfPaciente(formatCPF(e.target.value))}
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoSaude">Estado de Saúde *</Label>
              <select
                id="estadoSaude"
                value={estadoSaude}
                onChange={(e) => setEstadoSaude(e.target.value)}
                className="flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="andando">Andando</option>
                <option value="cadeirante">Cadeirante</option>
                <option value="maca">Maca</option>
                <option value="acamado">Acamado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAgendamento">
                  Data *
                  <span className="text-xs text-muted-foreground ml-2">
                    (mín: 3 dia útil de antecedência)
                  </span>
                </Label>
                <Input
                  id="dataAgendamento"
                  type="date"
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  min={dataMinima}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaAgendamento">Hora *</Label>
                <Input
                  id="horaAgendamento"
                  type="time"
                  value={horaAgendamento}
                  onChange={(e) => setHoraAgendamento(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o paciente ou situação..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="xl:col-span-2 p-3 md:p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          <span className="text-sm md:text-base">{error}</span>
        </motion.div>
      )}

      <div className="xl:col-span-2 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onVoltar}
          variant="outline"
          className="w-full sm:w-auto h-12 md:h-10 text-base md:text-lg font-bold text-foreground"
          size="lg"
          disabled={enviando}
        >
          <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Voltar
        </Button>

        <Button
          onClick={onConfirmar}
          className="h-12 md:h-10 w-full sm:w-auto text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 text-foreground"
          size="lg"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Confirmar Viagem
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export const DadosPaciente = memo(DadosPacienteComponent);
