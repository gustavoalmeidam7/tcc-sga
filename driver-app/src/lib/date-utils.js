export const formatarData = (dataISO) => {
  if (!dataISO) return "Não informado";
  const [year, month, day] = dataISO.split("T")[0].split("-").map(Number);
  const data = new Date(Date.UTC(year, month - 1, day));
  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatarDataHora = (dataISO) => {
  if (!dataISO) return "Data não disponível";
  const data = new Date(dataISO);
  return data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatarHora = (dataISO) => {
  if (!dataISO) return "Hora não disponível";
  const data = new Date(dataISO);
  return data.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatarDateTimeParaBackend = (
  dataStr,
  horaStr,
  duracaoMinutos = 0
) => {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const [hora, minuto] = horaStr.split(":").map(Number);

  const date = new Date(ano, mes - 1, dia, hora, minuto, 0);

  if (duracaoMinutos > 0) {
    date.setMinutes(date.getMinutes() + duracaoMinutos);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatarDateParaBackend = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
