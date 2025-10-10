export const getStatusViagem = (viagem) => {
  const agora = new Date();
  const inicio = new Date(viagem.inicio);
  const fim = new Date(viagem.fim);

  if (agora < inicio) return "pendente";
  if (agora >= inicio && agora <= fim) return "em_andamento";
  return "concluida";
};

export const getStatusBadge = (status) => {
  const badges = {
    pendente: { label: "Pendente", className: "bg-yellow-500 hover:bg-yellow-600" },
    em_andamento: { label: "Em andamento", className: "bg-blue-500 hover:bg-blue-600" },
    concluida: { label: "Concluída", className: "bg-green-500 hover:bg-green-600" },
  };
  return badges[status] || badges.pendente;
};

export const calcularDuracao = (inicio, fim) => {
  return Math.round((new Date(fim) - new Date(inicio)) / 60000);
};
