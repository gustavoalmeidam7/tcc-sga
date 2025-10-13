import { motion, AnimatePresence } from "framer-motion";
import { useViagem } from "./hooks/useViagem";
import { useRotaCalculation } from "./hooks/useRotaCalculation";
import { useValidacaoAgendamento } from "./hooks/useValidacaoAgendamento";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { FormularioRota } from "./components/FormularioRota";
import { MapaRota } from "./components/MapaRota";
import { DadosPaciente } from "./components/DadosPaciente";
import { ModalConfirmacao } from "./components/ModalConfirmacao";
import { createTravel } from "@/services/travelService";
import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function Viagens() {
  const viagem = useViagem();
  const queryClient = useQueryClient();
  const { validarAgendamento, getDataMinimaFormatada } = useValidacaoAgendamento();
  const [modalOpen, setModalOpen] = useState(false);
  const [dadosViagemConfirmada, setDadosViagemConfirmada] = useState(null);

  const createTravelMutation = useMutation({
    mutationFn: createTravel,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['travels'] });
      toast.success('Viagem criada com sucesso!', {
        description: 'A viagem foi agendada e está disponível na lista de agendamentos.',
        duration: 5000,
      });
    },
    onError: (error) => {
      const mensagemErro = error.response?.data?.Erros
        ? Object.values(error.response.data.Erros).join(", ")
        : error.message || "Erro ao criar viagem";

      toast.error('Erro ao criar viagem', {
        description: mensagemErro,
        duration: 6000,
      });
    },
  });

  useRotaCalculation(viagem.coordOrigem, viagem.coordDestino, (resultado) => {
    const centerLat = (viagem.coordOrigem[0] + viagem.coordDestino[0]) / 2;
    const centerLng = (viagem.coordOrigem[1] + viagem.coordDestino[1]) / 2;

    viagem.setRotaCompleta({
      rota: resultado.coordinates,
      distancia: resultado.distancia,
      duracao: resultado.duracao,
      center: [centerLat, centerLng],
      zoom: 12,
    });
  });

  const handleAvancarTela = useCallback(() => {
    if (!viagem.coordOrigem || !viagem.coordDestino) {
      viagem.setError("Selecione origem e destino");
      return;
    }
    viagem.setError("");
    viagem.setTelaAtual(2);
  }, [viagem.coordOrigem, viagem.coordDestino, viagem.setError, viagem.setTelaAtual]);

  const handleVoltarTela = useCallback(() => {
    viagem.setTelaAtual(1);
  }, [viagem.setTelaAtual]);

  const dataMinima = useMemo(() => getDataMinimaFormatada(1), [getDataMinimaFormatada]);

  const handleConfirmarViagem = async () => {
    if (!viagem.nomePaciente || !viagem.cpfPaciente || !viagem.dataAgendamento || !viagem.horaAgendamento) {
      viagem.setError("Preencha todos os campos obrigatórios");
      return;
    }

    const validacao = validarAgendamento(
      viagem.dataAgendamento,
      viagem.horaAgendamento,
      viagem.duracao,
      1 
    );

    if (!validacao.valido) {
      viagem.setError(validacao.mensagem);
      return;
    }

    viagem.setError("");

    try {
      const inicioLocal = `${viagem.dataAgendamento}T${viagem.horaAgendamento}:00`;
      const inicio = new Date(inicioLocal);
      const fim = new Date(inicio.getTime() + viagem.duracao * 60000);

      const fimAno = fim.getFullYear();
      const fimMes = String(fim.getMonth() + 1).padStart(2, '0');
      const fimDia = String(fim.getDate()).padStart(2, '0');
      const fimHora = String(fim.getHours()).padStart(2, '0');
      const fimMin = String(fim.getMinutes()).padStart(2, '0');
      const fimLocal = `${fimAno}-${fimMes}-${fimDia}T${fimHora}:${fimMin}:00`;

      const dadosBackend = {
        inicio: inicioLocal,
        fim: fimLocal,
        local_inicio: viagem.origem,
        local_fim: viagem.destino,
      };

      await createTravelMutation.mutateAsync(dadosBackend);

      setDadosViagemConfirmada({
        nomePaciente: viagem.nomePaciente,
        cpfPaciente: viagem.cpfPaciente,
        dataAgendamento: viagem.dataAgendamento,
        horaAgendamento: viagem.horaAgendamento,
        origem: viagem.origem,
        destino: viagem.destino,
        distancia: viagem.distancia,
        duracao: viagem.duracao,
      });

      setModalOpen(true);

      viagem.resetarFormulario();
    } catch (error) {
      console.error("Erro ao criar viagem:", error);

      const mensagemErro = error.response?.data?.Erros
        ? Object.values(error.response.data.Erros).join(", ")
        : error.message || "Erro ao criar viagem. Tente novamente.";

      viagem.setError(mensagemErro);
    }
  };

  return (
    <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 md:p-5 lg:p-3 border border-primary/20"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-1">
            🚑 Solicitação de Viagem
          </h1>
          <p className="text-sm text-muted-foreground">
            {viagem.telaAtual === 1
              ? "Selecione origem e destino"
              : "Preencha os dados do paciente"}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
      </motion.header>

      <ProgressIndicator telaAtual={viagem.telaAtual} />

      <AnimatePresence mode="wait">
        {viagem.telaAtual === 1 && (
          <motion.div
            key="tela1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <FormularioRota
                origem={viagem.origem}
                destino={viagem.destino}
                setOrigem={viagem.setOrigem}
                setDestino={viagem.setDestino}
                setCoordOrigem={viagem.setCoordOrigem}
                setCoordDestino={viagem.setCoordDestino}
                distancia={viagem.distancia}
                duracao={viagem.duracao}
                rota={viagem.rota}
                error={viagem.error}
                onAvancar={handleAvancarTela}
              />

              <MapaRota
                center={viagem.center}
                zoom={viagem.zoom}
                coordOrigem={viagem.coordOrigem}
                coordDestino={viagem.coordDestino}
                origem={viagem.origem}
                destino={viagem.destino}
                rota={viagem.rota}
                loading={viagem.loading}
              />
            </div>
          </motion.div>
        )}

        {viagem.telaAtual === 2 && (
          <motion.div
            key="tela2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DadosPaciente
              origem={viagem.origem}
              destino={viagem.destino}
              distancia={viagem.distancia}
              duracao={viagem.duracao}
              nomePaciente={viagem.nomePaciente}
              setNomePaciente={viagem.setNomePaciente}
              cpfPaciente={viagem.cpfPaciente}
              setCpfPaciente={viagem.setCpfPaciente}
              estadoSaude={viagem.estadoSaude}
              setEstadoSaude={viagem.setEstadoSaude}
              dataAgendamento={viagem.dataAgendamento}
              setDataAgendamento={viagem.setDataAgendamento}
              horaAgendamento={viagem.horaAgendamento}
              setHoraAgendamento={viagem.setHoraAgendamento}
              observacoes={viagem.observacoes}
              setObservacoes={viagem.setObservacoes}
              dataMinima={dataMinima}
              error={viagem.error}
              enviando={createTravelMutation.isPending}
              onVoltar={handleVoltarTela}
              onConfirmar={handleConfirmarViagem}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ModalConfirmacao
        open={modalOpen}
        onOpenChange={setModalOpen}
        dadosViagem={dadosViagemConfirmada}
      />
    </main>
  );
}

export default Viagens;
