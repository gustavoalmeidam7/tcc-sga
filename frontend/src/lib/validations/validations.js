import { z } from "zod";
import { unmaskCPF, unmaskPhone } from "@/lib/format-utils";

export const validarCPF = (cpf) => {
  if (typeof cpf !== "string") return false;

  const cpfLimpo = unmaskCPF(cpf);

  if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;

  const cpfDigits = cpfLimpo.split("").map((el) => +el);

  const calcularDigito = (count) => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };

  return (
    calcularDigito(10) === cpfDigits[9] && calcularDigito(11) === cpfDigits[10]
  );
};

export const validarTelefone = (telefone) => {
  if (typeof telefone !== "string") return false;
  const telefoneLimpo = unmaskPhone(telefone);
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha) => {
  return senha && senha.length >= 8;
};

export const cpfSchema = z.string().refine(validarCPF, {
  message: "CPF inválido",
});

export const emailSchema = z.string().email({
  message: "Por favor, insira um email válido.",
});

export const telefoneSchema = z.string().refine(validarTelefone, {
  message: "Insira um número de telefone válido (10 ou 11 dígitos).",
});

export const senhaSchema = z.string().min(8, {
  message: "A senha deve ter no mínimo 8 caracteres.",
});

export const nomeSchema = z
  .string()
  .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
  .max(100, { message: "O nome não pode ter mais de 100 caracteres." });

export const nascimentoSchema = z.string().refine(
  (val) => {
    const data = new Date(val);
    const hoje = new Date();
    const idade = hoje.getFullYear() - data.getFullYear();

    return !isNaN(data.getTime()) && idade >= 0 && idade <= 100;
  },
  {
    message: "Insira uma data de nascimento válida.",
  }
);

export const loginSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, { message: "A senha é obrigatória." }),
});

export const registroSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    cpf: cpfSchema,
    telefone: telefoneSchema,
    nascimento: nascimentoSchema,
    senha: senhaSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.senha === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const perfilSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  cpf: cpfSchema,
  telefone: telefoneSchema,
  nascimento: nascimentoSchema,
});

export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, { message: "Senha atual é obrigatória." }),
    novaSenha: senhaSchema,
    confirmNovaSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmNovaSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmNovaSenha"],
  })
  .refine((data) => data.senhaAtual !== data.novaSenha, {
    message: "A nova senha deve ser diferente da senha atual.",
    path: ["novaSenha"],
  });

export const validarCNH = (cnh) => {
  if (typeof cnh !== "string") return false;
  const cnhLimpa = cnh.replace(/\D/g, "");

  if (cnhLimpa.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cnhLimpa)) return false;

  return true;
};

export const validarDataVencimento = (data) => {
  if (!data) return false;
  const dataVencimento = new Date(data);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return dataVencimento >= hoje;
};

export const cnhSchema = z.string().refine(validarCNH, {
  message: "CNH deve ter 11 dígitos numéricos válidos.",
});

export const vencimentoCNHSchema = z.string().refine(validarDataVencimento, {
  message: "A CNH não pode estar vencida.",
});

export const ambulanciaIdSchema = z.string().min(1, {
  message: "ID da ambulância é obrigatório.",
});

export const motoristaSchema = z.object({
  cnh: cnhSchema,
  vencimento: vencimentoCNHSchema,
  id_ambulancia: ambulanciaIdSchema,
});
