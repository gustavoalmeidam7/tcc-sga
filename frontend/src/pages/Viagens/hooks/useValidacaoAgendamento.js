import { useCallback, useMemo } from "react";
import {
  isDiaUtil,
  calcularDiasUteis,
  calcularDataMinimaAgendamento,
  getDataMinimaFormatada,
  validarTempoSuficiente,
} from "../schemas/travel-schemas";

export function useValidacaoAgendamento(diasUteisAntecedencia = 3) {
  const validarAgendamento = useCallback(
    (dataAgendamento, horaAgendamento, duracaoViagemMinutos) => {
      if (!dataAgendamento || !horaAgendamento) {
        return {
          valido: false,
          mensagem: "Data e hora são obrigatórias",
          dataMinima: null,
        };
      }

      if (!duracaoViagemMinutos || duracaoViagemMinutos <= 0) {
        return {
          valido: false,
          mensagem:
            "Selecione origem e destino para calcular a duração da viagem",
          dataMinima: null,
        };
      }

      const agora = new Date();
      const dataHoraAgendamento = new Date(
        `${dataAgendamento}T${horaAgendamento}`
      );
      const dataMinima = calcularDataMinimaAgendamento(diasUteisAntecedencia);

      if (!isDiaUtil(dataHoraAgendamento)) {
        return {
          valido: false,
          mensagem:
            "O agendamento deve ser em dia útil (segunda a sexta-feira)",
          dataMinima,
        };
      }

      const diasUteisEntre = calcularDiasUteis(agora, dataHoraAgendamento);

      if (diasUteisEntre < diasUteisAntecedencia) {
        return {
          valido: false,
          mensagem: `O agendamento deve ser feito com no mínimo ${diasUteisAntecedencia} dia(s) útil de antecedência`,
          dataMinima,
        };
      }

      const validacaoTempo = validarTempoSuficiente(
        dataAgendamento,
        horaAgendamento,
        duracaoViagemMinutos
      );

      if (!validacaoTempo.valido) {
        return {
          valido: false,
          mensagem: validacaoTempo.mensagem,
          dataMinima,
        };
      }

      return {
        valido: true,
        mensagem: "",
        dataMinima,
      };
    },
    [diasUteisAntecedencia]
  );

  return useMemo(
    () => ({
      validarAgendamento,
      calcularDataMinimaAgendamento: () =>
        calcularDataMinimaAgendamento(diasUteisAntecedencia),
      getDataMinimaFormatada: () =>
        getDataMinimaFormatada(diasUteisAntecedencia),
      isDiaUtil,
      calcularDiasUteis,
    }),
    [validarAgendamento, diasUteisAntecedencia]
  );
}
