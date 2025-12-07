export const formatCPF = (value) => {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d)/, "$1.$2");
  if (numbers.length <= 9)
    return numbers.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
  return numbers
    .replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
    .slice(0, 14);
};

export const formatPhone = (value) => {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return numbers.replace(/(\d{2})(\d)/, "($1) $2");
  if (numbers.length <= 10)
    return numbers.replace(/(\d{2})(\d{4})(\d)/, "($1) $2-$3");
  return numbers.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3").slice(0, 15);
};

export const unmaskCPF = (cpf) => {
  if (!cpf) return "";
  return cpf.replace(/\D/g, "");
};

export const unmaskPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

export const formatarEndereco = (enderecoCompleto) => {
  if (!enderecoCompleto || typeof enderecoCompleto !== "string") {
    return enderecoCompleto || "Carregando...";
  }

  if (
    enderecoCompleto.includes(",") &&
    enderecoCompleto.split(",").length <= 3
  ) {
    return enderecoCompleto;
  }

  const removerPadroes = [
    /Região Imediata de[^,]*/gi,
    /Região Geográfica Intermediária de[^,]*/gi,
    /Região Geográfica[^,]*/gi,
    /Região Sudeste/gi,
    /Região Sul/gi,
    /Região Nordeste/gi,
    /Região Norte/gi,
    /Região Centro-Oeste/gi,
    /, Brasil$/i,
    /, Brazil$/i,
  ];

  let enderecoLimpo = enderecoCompleto;
  removerPadroes.forEach((padrao) => {
    enderecoLimpo = enderecoLimpo.replace(padrao, "");
  });

  enderecoLimpo = enderecoLimpo
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();

  const cepMatch = enderecoLimpo.match(/\b(\d{5}-?\d{3})\b/);
  const cep = cepMatch ? cepMatch[1] : null;

  if (cep) {
    enderecoLimpo = enderecoLimpo.replace(/\b\d{5}-?\d{3}\b/, "").trim();
  }

  const partes = enderecoLimpo
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (partes.length === 0) {
    return enderecoCompleto;
  }

  const estados = [
    "São Paulo",
    "SP",
    "Rio de Janeiro",
    "RJ",
    "Minas Gerais",
    "MG",
    "Espírito Santo",
    "ES",
    "Paraná",
    "PR",
    "Santa Catarina",
    "SC",
    "Rio Grande do Sul",
    "RS",
    "Bahia",
    "BA",
    "Ceará",
    "CE",
    "Pernambuco",
    "PE",
    "Goiás",
    "GO",
    "Distrito Federal",
    "DF",
  ];

  let rua = "";
  let bairro = "";
  let cidade = "";

  if (partes.length > 0) {
    rua = partes[0];
  }

  let indiceEstado = -1;
  for (let i = partes.length - 1; i >= 0; i--) {
    if (estados.includes(partes[i])) {
      indiceEstado = i;
      break;
    }
  }

  if (indiceEstado > 0) {
    cidade = partes[indiceEstado - 1];
  } else if (partes.length >= 2) {
    const ultimaParteIndex = partes.length - 1;
    const ultimaParte = partes[ultimaParteIndex];
    if (!ultimaParte.match(/^\d{5}-?\d{3}$/)) {
      cidade = ultimaParte;
    } else if (partes.length >= 3) {
      cidade = partes[ultimaParteIndex - 1];
    }
  }

  if (partes.length > 2 && rua && cidade) {
    const indiceRua = partes.indexOf(rua);
    const indiceCidade = partes.indexOf(cidade);

    for (let i = indiceRua + 1; i < indiceCidade; i++) {
      const parte = partes[i];
      if (
        parte !== cidade &&
        !estados.includes(parte) &&
        !parte.match(/^\d{5}-?\d{3}$/) &&
        parte.length > 2
      ) {
        bairro = parte;
        break;
      }
    }
  } else if (partes.length === 2 && !cidade) {
    bairro = partes[1];
  }

  const partesFormatadas = [];
  if (rua) partesFormatadas.push(rua);
  if (bairro && bairro !== cidade) partesFormatadas.push(bairro);
  if (cidade) partesFormatadas.push(cidade);
  if (cep) partesFormatadas.push(cep);

  return partesFormatadas.join(", ") || enderecoCompleto;
};
