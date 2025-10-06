export const formatarData = (dataISO) => {
  if (!dataISO) return "Não informado";
  const [year, month, day] = dataISO.split('T')[0].split('-').map(Number);
  const data = new Date(Date.UTC(year, month - 1, day));
  return data.toLocaleDateString("pt-BR", { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' });
};

export const formatarDataHora = (dataISO) => {
  if (!dataISO) return "Data não disponível";
  const data = new Date(dataISO);
  return data.toLocaleString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
