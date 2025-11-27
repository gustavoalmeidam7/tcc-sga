export function isTravelToday(dataInicio) {
  if (!dataInicio) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataViagem = new Date(dataInicio);
  dataViagem.setHours(0, 0, 0, 0);

  return dataViagem.getTime() === hoje.getTime();
}

export function isTravelFuture(dataInicio) {
  if (!dataInicio) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataViagem = new Date(dataInicio);
  dataViagem.setHours(0, 0, 0, 0);

  return dataViagem.getTime() > hoje.getTime();
}

export function hasSameTime(dataHora1, dataHora2) {
  if (!dataHora1 || !dataHora2) return false;

  const date1 = new Date(dataHora1);
  const date2 = new Date(dataHora2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes()
  );
}

export function checkTimeConflict(novaViagem, viagensAceitas) {
  if (!novaViagem || !viagensAceitas || viagensAceitas.length === 0) {
    return {
      hasConflict: false,
      conflictingTravel: null,
      message: "",
    };
  }

  const viagensAtivas = viagensAceitas.filter(
    (v) => v.realizado === 1 && !v.cancelada
  );

  if (viagensAtivas.length > 0) {
    return {
      hasConflict: true,
      conflictingTravel: viagensAtivas[0],
      message:
        "Você já possui uma viagem em andamento. Finalize-a antes de aceitar outra.",
    };
  }

  const viagensPendentes = viagensAceitas.filter(
    (v) => v.realizado === 0 && !v.cancelada && v.id !== novaViagem.id
  );

  for (const viagem of viagensPendentes) {
    if (hasSameTime(novaViagem.inicio, viagem.inicio)) {
      return {
        hasConflict: true,
        conflictingTravel: viagem,
        message: `Já existe uma viagem agendada para o mesmo horário (${new Date(
          viagem.inicio
        ).toLocaleString("pt-BR")}).`,
      };
    }
  }

  return {
    hasConflict: false,
    conflictingTravel: null,
    message: "",
  };
}

export function validateTravelAcceptance(
  viagem,
  todasViagens,
  hasActiveTravel
) {
  if (!viagem) {
    return {
      canAccept: false,
      message: "Viagem inválida.",
    };
  }

  if (viagem.cancelada) {
    return {
      canAccept: false,
      message: "Esta viagem foi cancelada e não pode ser aceita.",
    };
  }

  if (viagem.realizado === 1) {
    return {
      canAccept: false,
      message: "Esta viagem já foi iniciada.",
    };
  }

  if (viagem.realizado === 2) {
    return {
      canAccept: false,
      message: "Esta viagem já foi concluída.",
    };
  }

  if (hasActiveTravel) {
    return {
      canAccept: false,
      message:
        "Você já possui uma viagem em andamento. Finalize-a antes de aceitar outra.",
    };
  }

  if (!isTravelToday(viagem.inicio)) {
    return {
      canAccept: false,
      message: "Apenas viagens de hoje podem ser aceitas.",
    };
  }

  const conflictCheck = checkTimeConflict(viagem, todasViagens);
  if (conflictCheck.hasConflict) {
    return {
      canAccept: false,
      message: conflictCheck.message,
    };
  }

  return {
    canAccept: true,
    message: "",
  };
}

export function separateTravelsByDate(viagens) {
  if (!viagens || !Array.isArray(viagens)) {
    return {
      viagensHoje: [],
      viagensFuturas: [],
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const viagensHoje = [];
  const viagensFuturas = [];

  viagens.forEach((viagem) => {
    if (viagem.cancelada) return;

    const dataViagem = new Date(viagem.inicio);
    dataViagem.setHours(0, 0, 0, 0);

    if (dataViagem.getTime() === hoje.getTime()) {
      viagensHoje.push(viagem);
    } else if (dataViagem.getTime() > hoje.getTime()) {
      viagensFuturas.push(viagem);
    }
  });

  viagensHoje.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
  viagensFuturas.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

  return {
    viagensHoje,
    viagensFuturas,
  };
}
