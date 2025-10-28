import { memo } from "react";
import { FileText, Hash, MapPin } from "lucide-react";

const hasPacienteData = (viagem) => {
  return (
    viagem?.paciente_nome ||
    viagem?.paciente_cpf ||
    viagem?.paciente_estado ||
    viagem?.paciente_observacoes
  );
};

const PatientCardComponent = ({ viagem, loading }) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasPacienteData(viagem)) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          Sem dados fornecidos
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Nenhuma informação do paciente foi registrada para esta viagem
        </p>
      </div>
    );
  }

  const pacienteFields = [
    {
      icon: Hash,
      label: "CPF",
      value: viagem?.paciente_cpf || "Não informado",
    },
    {
      icon: MapPin,
      label: "Estado",
      value: viagem?.paciente_estado || "Não informado",
    },
    {
      icon: FileText,
      label: "Observações",
      value: viagem?.paciente_observacoes || "Não informado",
      multiline: !!viagem?.paciente_observacoes,
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary ring-4 ring-primary/10">
          <FileText className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Paciente Transportado
          </p>
          <h3 className="text-lg font-bold text-card-foreground">
            {viagem?.paciente_nome || "Não informado"}
          </h3>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        {pacienteFields.map((field, index) => (
          <div
            key={index}
            className={`flex gap-3 ${field.multiline ? "items-start pt-2" : "items-center"}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 ${field.multiline ? "flex-shrink-0" : ""}`}
            >
              <field.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p
                className={`text-xs text-muted-foreground ${field.multiline ? "mb-1" : ""}`}
              >
                {field.label}
              </p>
              <p
                className={`text-sm font-semibold text-card-foreground ${field.multiline ? "leading-relaxed font-normal" : ""}`}
              >
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PatientCard = memo(PatientCardComponent);
