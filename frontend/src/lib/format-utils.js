export const formatCPF = (value) => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d)/, '$1.$2');
  if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4').slice(0, 14);
};

export const formatPhone = (value) => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return numbers.replace(/(\d{2})(\d)/, '($1) $2');
  if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  return numbers.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3').slice(0, 15);
};

export const unmaskCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

export const unmaskPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};
