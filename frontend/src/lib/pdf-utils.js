import jsPDF from "jspdf";
import { formatarDataHora } from "@/lib/date-utils";
import { getTravelStatusLabel } from "@/lib/travel-status";
import logo from "@/assets/Logo.webp";

export const generateTravelReportPDF = async (
  viagem,
  enderecos,
  solicitante
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
  doc.text(getTravelStatusLabel(viagem.realizado), 60, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Data Agendada:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatarDataHora(viagem.inicio), 60, y);
  y += 12;

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
  doc.text(viagem.nome_paciente || "N/A", 35, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("CPF:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(viagem.cpf_paciente || "N/A", 35, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Idade:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${viagem.idade_paciente || "N/A"} anos`, 35, y);
  y += 12;

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
  doc.text(
    viagem.id_motorista ? `ID: ${viagem.id_motorista}` : "Não atribuído",
    45,
    y
  );
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Ambulância:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    viagem.id_ambulancia ? `ID: ${viagem.id_ambulancia}` : "Não atribuída",
    45,
    y
  );
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
  doc.text(solicitante?.nome || "N/A", 45, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Data da Solicitação:", 17, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatarDataHora(viagem.criado_em), 60, y);
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

  doc.save(`relatorio-viagem-${viagem.id}.pdf`);
};
