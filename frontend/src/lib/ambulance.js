export const AmbulanceStatus = {
  IN_USE: 0,
  ACTIVE: 1,
  INACTIVE: 2,
  MAINTENANCE: 3,
};

export const AmbulanceType = {
  A: 0,
  B: 1,
  C: 2,
};

export const AMBULANCE_STATUS_LABELS = {
  [AmbulanceStatus.IN_USE]: "Em Uso",
  [AmbulanceStatus.ACTIVE]: "Disponível",
  [AmbulanceStatus.INACTIVE]: "Inativa",
  [AmbulanceStatus.MAINTENANCE]: "Em Manutenção",
};

export const AMBULANCE_TYPE_LABELS = {
  [AmbulanceType.A]: "Tipo A",
  [AmbulanceType.B]: "Tipo B",
  [AmbulanceType.C]: "Tipo C",
};

export const AMBULANCE_STATUS_COLORS = {
  [AmbulanceStatus.IN_USE]: {
    className: "bg-blue-500 hover:bg-blue-600",
  },
  [AmbulanceStatus.ACTIVE]: {
    className: "bg-green-500 hover:bg-green-600",
  },
  [AmbulanceStatus.INACTIVE]: {
    className: "bg-gray-500 hover:bg-gray-600",
  },
  [AmbulanceStatus.MAINTENANCE]: {
    className: "bg-orange-500 hover:bg-orange-600",
  },
};

export const getAmbulanceStatusLabel = (status) => {
  return AMBULANCE_STATUS_LABELS[status] || "Desconhecido";
};

export const getAmbulanceTypeLabel = (tipo) => {
  return AMBULANCE_TYPE_LABELS[tipo] || "Desconhecido";
};

export const getAmbulanceStatusColors = (status) => {
  return (
    AMBULANCE_STATUS_COLORS[status] || {
      className: "bg-gray-500",
    }
  );
};


