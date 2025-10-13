import { useMemo } from "react";

export function useValidacaoAgendamento() {

  const isDiaUtil = (data) => {
    const diaSemana = data.getDay();
    return diaSemana >= 1 && diaSemana <= 5;
  };

  const proximoDiaUtil = (data) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + 1);

    while (!isDiaUtil(novaData)) {
      novaData.setDate(novaData.getDate() + 1);
    }

    return novaData;
  };

  const calcularDiasUteis = (dataInicio, dataFim) => {
    let diasUteis = 0;
    const dataAtual = new Date(dataInicio);
    dataAtual.setHours(0, 0, 0, 0);

    const dataFimComparacao = new Date(dataFim);
    dataFimComparacao.setHours(0, 0, 0, 0);

    while (dataAtual < dataFimComparacao) {
      if (isDiaUtil(dataAtual)) {
        diasUteis++;
      }
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return diasUteis;
  };

  const calcularDataMinimaAgendamento = (diasUteisAntecedencia = 1) => {
    let dataMinima = new Date();
    let diasUteisContados = 0;

    while (diasUteisContados < diasUteisAntecedencia) {
      dataMinima = proximoDiaUtil(dataMinima);
      diasUteisContados++;
    }

    return dataMinima;
  };

  const validarAgendamento = (dataAgendamento, horaAgendamento, duracaoViagemMinutos, diasUteisAntecedencia = 1) => {
    if (!dataAgendamento || !horaAgendamento) {
      return {
        valido: false,
        mensagem: "Data e hora são obrigatórias",
        dataMinima: null
      };
    }

    if (!duracaoViagemMinutos || duracaoViagemMinutos <= 0) {
      return {
        valido: false,
        mensagem: "Selecione origem e destino para calcular a duração da viagem",
        dataMinima: null
      };
    }

    const agora = new Date();
    const dataHoraAgendamento = new Date(`${dataAgendamento}T${horaAgendamento}`);
    const dataMinima = calcularDataMinimaAgendamento(diasUteisAntecedencia);

    const diasUteisEntre = calcularDiasUteis(agora, dataHoraAgendamento);

    if (diasUteisEntre < diasUteisAntecedencia) {
      const dataFormatada = dataMinima.toLocaleDateString("pt-BR");
      return {
        valido: false,
        mensagem: `O agendamento deve ser feito com no mínimo ${diasUteisAntecedencia} dia(s) útil de antecedência`,
        dataMinima
      };
    }

    const dataHoraFimViagem = new Date(dataHoraAgendamento.getTime() + duracaoViagemMinutos * 60000);
    const diferencaMinutos = (dataHoraAgendamento.getTime() - agora.getTime()) / 60000;

    if (diferencaMinutos < duracaoViagemMinutos) {
      const horasNecessarias = Math.ceil(duracaoViagemMinutos / 60);
      return {
        valido: false,
        mensagem: `Não há tempo suficiente para realizar esta viagem. A viagem leva ${Math.ceil(duracaoViagemMinutos / 60)}h ${duracaoViagemMinutos % 60}min e deve ser agendada com mais antecedência.`,
        dataMinima
      };
    }

    if (!isDiaUtil(dataHoraAgendamento)) {
      return {
        valido: false,
        mensagem: "O agendamento deve ser em dia útil (segunda a sexta-feira)",
        dataMinima
      };
    }

    return {
      valido: true,
      mensagem: "",
      dataMinima
    };
  };

  const getDataMinimaFormatada = (diasUteisAntecedencia = 1) => {
    const dataMinima = calcularDataMinimaAgendamento(diasUteisAntecedencia);
    const ano = dataMinima.getFullYear();
    const mes = String(dataMinima.getMonth() + 1).padStart(2, '0');
    const dia = String(dataMinima.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  return {
    validarAgendamento,
    calcularDataMinimaAgendamento,
    getDataMinimaFormatada,
    isDiaUtil,
    calcularDiasUteis,
  };
}
