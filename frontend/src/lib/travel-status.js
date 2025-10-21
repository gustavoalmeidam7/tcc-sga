export const TravelStatus = {
  NAO_REALIZADO: 0,
  EM_PROGRESSO: 1,
  REALIZADO: 2,
};

export const TRAVEL_STATUS_LABELS = {
  [TravelStatus.NAO_REALIZADO]: "Pendente",
  [TravelStatus.EM_PROGRESSO]: "Em Progresso",
  [TravelStatus.REALIZADO]: "Concluída",
};

export const TRAVEL_STATUS_COLORS = {
  [TravelStatus.NAO_REALIZADO]: {
    className: "bg-yellow-500 hover:bg-yellow-600"
  },
  [TravelStatus.EM_PROGRESSO]: {
    className: "bg-blue-500 hover:bg-blue-600"
  },
  [TravelStatus.REALIZADO]: {
    className: "bg-green-500 hover:bg-green-600"
  },
};

export const getTravelStatusLabel = (status) => {
  return TRAVEL_STATUS_LABELS[status] || "Desconhecido";
};

export const getTravelStatusColors = (status) => {
  return TRAVEL_STATUS_COLORS[status] || {
    className: "bg-gray-500"
  };
};
