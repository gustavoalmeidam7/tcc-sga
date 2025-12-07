export const calcularDuracao = (inicio, fim) => {
  return Math.round((new Date(fim) - new Date(inicio)) / 60000);
};
