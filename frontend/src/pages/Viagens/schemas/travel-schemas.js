import { z } from "zod";
import { cpfSchema, nomeSchema } from "@/lib/validations/validations";

export const isDiaUtil = (data) => {
  const diaSemana = data.getDay();
  return diaSemana >= 1 && diaSemana <= 5;
};

export const proximoDiaUtil = (data) => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + 1);

  while (!isDiaUtil(novaData)) {
    novaData.setDate(novaData.getDate() + 1);
  }

  return novaData;
};

export const calcularDiasUteis = (dataInicio, dataFim) => {
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

export const calcularDataMinimaAgendamento = (diasUteisAntecedencia = 3) => {
  let dataMinima = new Date();
  let diasUteisContados = 0;

  while (diasUteisContados < diasUteisAntecedencia) {
    dataMinima = proximoDiaUtil(dataMinima);
    diasUteisContados++;
  }

  return dataMinima;
};

export const getDataMinimaFormatada = (diasUteisAntecedencia = 3) => {
  const dataMinima = calcularDataMinimaAgendamento(diasUteisAntecedencia);
  const ano = dataMinima.getFullYear();
  const mes = String(dataMinima.getMonth() + 1).padStart(2, "0");
  const dia = String(dataMinima.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export const validarTempoSuficiente = (
  dataAgendamento,
  horaAgendamento,
  duracaoViagemMinutos
) => {
  const agora = new Date();
  const dataHoraAgendamento = new Date(`${dataAgendamento}T${horaAgendamento}`);
  const diferencaMinutos =
    (dataHoraAgendamento.getTime() - agora.getTime()) / 60000;

  if (diferencaMinutos < duracaoViagemMinutos) {
    return {
      valido: false,
      mensagem: `Não há tempo suficiente para realizar esta viagem. A viagem leva ${Math.ceil(
        duracaoViagemMinutos / 60
      )}h ${
        duracaoViagemMinutos % 60
      }min e deve ser agendada com mais antecedência.`,
    };
  }

  return { valido: true, mensagem: "" };
};

const diaUtilValidator = z.string().refine(
  (dataStr) => {
    if (!dataStr) return false;
    const data = new Date(dataStr);
    return !isNaN(data.getTime()) && isDiaUtil(data);
  },
  {
    message: "O agendamento deve ser em dia útil (segunda a sexta-feira)",
  }
);

const antecedenciaMinimaValidator = (diasUteisAntecedencia = 3) =>
  z.string().refine(
    (dataStr) => {
      if (!dataStr) return false;

      const dataAgendamento = new Date(dataStr);
      if (isNaN(dataAgendamento.getTime())) return false;

      const agora = new Date();
      const diasUteisEntre = calcularDiasUteis(agora, dataAgendamento);

      return diasUteisEntre >= diasUteisAntecedencia;
    },
    {
      message: `O agendamento deve ser feito com no mínimo ${diasUteisAntecedencia} dia(s) útil de antecedência`,
    }
  );

export const rotaSchema = z.object({
  origem: z.string().min(3, {
    message: "Selecione um endereço de origem válido",
  }),
  destino: z.string().min(3, {
    message: "Selecione um endereço de destino válido",
  }),
  coordOrigem: z.array(z.number()).length(2, {
    message: "Coordenadas de origem inválidas",
  }),
  coordDestino: z.array(z.number()).length(2, {
    message: "Coordenadas de destino inválidas",
  }),
  duracao: z.number().positive({
    message: "Selecione origem e destino para calcular a duração da viagem",
  }),
  distancia: z.string().optional(),
});

export const createDadosPacienteSchema = (diasUteisAntecedencia = 3) =>
  z.object({
    nomePaciente: nomeSchema,

    cpfPaciente: cpfSchema,

    dataAgendamento: z
      .string()
      .min(1, { message: "Data é obrigatória" })
      .pipe(diaUtilValidator)
      .pipe(antecedenciaMinimaValidator(diasUteisAntecedencia)),

    horaAgendamento: z
      .string()
      .min(1, { message: "Hora é obrigatória" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Formato de hora inválido (use HH:MM)",
      }),

    estadoSaude: z
      .string()
      .max(200, {
        message: "O estado de saúde não pode ter mais de 200 caracteres",
      })
      .optional(),

    observacoes: z
      .string()
      .max(500, {
        message: "As observações não podem ter mais de 500 caracteres",
      })
      .optional(),
  });

export const createViagemCompletaSchema = (diasUteisAntecedencia = 3) =>
  z.object({
    ...rotaSchema.shape,
    ...createDadosPacienteSchema(diasUteisAntecedencia).shape,
  });

export const viagemBackendSchema = z.object({
  inicio: z.string().datetime({ message: "Data/hora de início inválida" }),
  fim: z.string().datetime({ message: "Data/hora de fim inválida" }),
  local_inicio: z.string().min(3, { message: "Local de início inválido" }),
  local_fim: z.string().min(3, { message: "Local de fim inválido" }),
});
