import jsPDF from "jspdf";
import { formatarDataHora } from "@/lib/date-utils";
import { getTravelStatusLabel } from "@/lib/travel-status";
import logo from "@/assets/Logo.webp";

const getEstadoPacienteLabel = (estado) => {
  const estados = {
    0: "Cadeirante",
    1: "Maca",
    2: "Acamado",
  };
  return estados[estado] || "Não informado";
};

const formatarCPF = (cpf) => {
  if (!cpf) return "N/A";
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return cpf;
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatarTelefone = (telefone) => {
  if (!telefone) return "N/A";
  const telefoneLimpo = telefone.replace(/\D/g, "");
  if (telefoneLimpo.length === 10) {
    return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
};

const gerarNomeArquivo = (viagem) => {
  const data = new Date(viagem.inicio || new Date());
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const dataFormatada = `${ano}${mes}${dia}`;
  const horaFormatada = `${hora}${minuto}`;
  return `Relatorio-Viagem-${viagem.id}-${dataFormatada}-${horaFormatada}.pdf`;
};

export const generateTravelReportPDF = async (
  viagem,
  enderecos,
  solicitante,
  motorista = null
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let y = 20;

  const primaryColor = [41, 128, 185];
  const textColor = [52, 73, 94];
  const lightGray = [240, 240, 240];

  const img = new Image();
  img.src = logo;
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  doc.addImage(img, "WEBP", 15, y - 5, 20, 20);

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Relatório de Viagem", 40, y + 5);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${viagem.id}`, 40, y + 12);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString(
      "pt-BR"
    )} às ${new Date().toLocaleTimeString("pt-BR")}`,
    pageWidth - 15,
    y + 5,
    { align: "right" }
  );

  y += 25;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Status da Viagem:", 15, y);
  doc.setFont("helvetica", "normal");
  const statusLabel = viagem.cancelada
    ? "Cancelada"
    : getTravelStatusLabel(viagem.realizado);
  doc.text(statusLabel, 60, y);
  y += 7;

  if (viagem.cancelada) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text("⚠ Viagem Cancelada", 15, y);
    doc.setTextColor(...textColor);
    y += 7;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Data Agendada:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatarDataHora(viagem.inicio), 60, y);
  y += 7;

  if (viagem.fim) {
    doc.setFont("helvetica", "bold");
    doc.text("Previsão de Término:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatarDataHora(viagem.fim), 65, y);
    y += 7;
  }

  y += 5;

  doc.setFillColor(...lightGray);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Informações do Paciente", 17, y + 6);
  doc.setTextColor(...textColor);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Nome:", 17, y);
  doc.setFont("helvetica", "normal");
  const nomePaciente = solicitante?.nome || "N/A";
  doc.text(nomePaciente, 35, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("CPF:", 17, y);
  doc.setFont("helvetica", "normal");
  const cpfPaciente = viagem.cpf_paciente || "N/A";
  doc.text(formatarCPF(cpfPaciente), 35, y);
  y += 7;

  if (viagem.estado_paciente !== undefined && viagem.estado_paciente !== null) {
    doc.setFont("helvetica", "bold");
    doc.text("Estado de Saúde:", 17, y);
    doc.setFont("helvetica", "normal");
    doc.text(getEstadoPacienteLabel(viagem.estado_paciente), 55, y);
    y += 7;
  }

  if (viagem.observacoes) {
    doc.setFont("helvetica", "bold");
    doc.text("Observações:", 17, y);
    doc.setFont("helvetica", "normal");
    const observacoes = viagem.observacoes || "";
    const observacoesLines = doc.splitTextToSize(observacoes, pageWidth - 50);
    doc.text(observacoesLines, 17, y + 5);
    y += observacoesLines.length * 5 + 3;
  }

  y += 5;

  doc.setFillColor(...lightGray);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Trajeto", 17, y + 6);
  doc.setTextColor(...textColor);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Origem:", 17, y);
  doc.setFont("helvetica", "normal");
  const origemLines = doc.splitTextToSize(
    enderecos.origem || "N/A",
    pageWidth - 50
  );
  doc.text(origemLines, 17, y + 5);
  y += origemLines.length * 5 + 8;

  doc.setFont("helvetica", "bold");
  doc.text("Destino:", 17, y);
  doc.setFont("helvetica", "normal");
  const destinoLines = doc.splitTextToSize(
    enderecos.destino || "N/A",
    pageWidth - 50
  );
  doc.text(destinoLines, 17, y + 5);
  y += destinoLines.length * 5 + 12;

  doc.setFillColor(...lightGray);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Recursos Alocados", 17, y + 6);
  doc.setTextColor(...textColor);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Motorista:", 17, y);
  doc.setFont("helvetica", "normal");
  if (motorista && motorista.nome) {
    doc.text(motorista.nome, 45, y);
    y += 7;
    if (motorista.email) {
      doc.setFont("helvetica", "bold");
      doc.text("Email:", 17, y);
      doc.setFont("helvetica", "normal");
      doc.text(motorista.email, 45, y);
      y += 7;
    }
    if (motorista.telefone) {
      doc.setFont("helvetica", "bold");
      doc.text("Telefone:", 17, y);
      doc.setFont("helvetica", "normal");
      doc.text(formatarTelefone(motorista.telefone), 50, y);
      y += 7;
    }
  } else if (viagem.id_motorista) {
    doc.text("Atribuído (dados não disponíveis)", 45, y);
    y += 7;
  } else {
    doc.text("Não atribuído", 45, y);
    y += 7;
  }

  y += 2;

  doc.setFont("helvetica", "bold");
  doc.text("Ambulância:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(viagem.id_ambulancia ? "Atribuída" : "Não atribuída", 50, y);
  y += 12;

  doc.setFillColor(...lightGray);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Detalhes da Solicitação", 17, y + 6);
  doc.setTextColor(...textColor);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Solicitante:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(solicitante?.nome || "N/A", 50, y);
  y += 7;

  if (solicitante?.email) {
    doc.setFont("helvetica", "bold");
    doc.text("Email:", 17, y);
    doc.setFont("helvetica", "normal");
    doc.text(solicitante.email, 50, y);
    y += 7;
  }

  if (solicitante?.telefone) {
    doc.setFont("helvetica", "bold");
    doc.text("Telefone:", 17, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatarTelefone(solicitante.telefone), 50, y);
    y += 7;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Data da Solicitação:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatarDataHora(viagem.criado_em), 65, y);
  y += 12;

  doc.setDrawColor(...primaryColor);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text(
    "SGA - Sistema de Gestão de Ambulâncias",
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" }
  );
  doc.setFontSize(8);
  doc.text("Documento gerado automaticamente", pageWidth / 2, pageHeight - 7, {
    align: "center",
  });

  doc.save(gerarNomeArquivo(viagem));
};
