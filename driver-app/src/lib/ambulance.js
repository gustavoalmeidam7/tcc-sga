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

export const getAmbulanceStatusLabel = (status) => {
  return AMBULANCE_STATUS_LABELS[status] || "Desconhecido";
};

export const getAmbulanceTypeLabel = (tipo) => {
  return AMBULANCE_TYPE_LABELS[tipo] || "Desconhecido";
};

export const getAmbulanceStatusColor = (status) => {
  const colors = {
    [AmbulanceStatus.IN_USE]: { bg: "#3B82F6", text: "white" },
    [AmbulanceStatus.ACTIVE]: { bg: "#22C55E", text: "white" },
    [AmbulanceStatus.INACTIVE]: { bg: "#6B7280", text: "white" },
    [AmbulanceStatus.MAINTENANCE]: { bg: "#F59E0B", text: "white" },
  };
  return colors[status] || { bg: "#6B7280", text: "white" };
};
