import { User, Phone, Mail, AlertCircle } from "lucide-react";

export const PersonCard = ({
  person,
  title,
  subtitle,
  icon: Icon = User,
  loading,
}) => {
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

  if (!person) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary ring-4 ring-primary/10">
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-lg font-bold text-card-foreground">
            {person.nome}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Telefone</p>
            <p className="text-sm font-semibold text-card-foreground">
              {person.telefone}
            </p>
          </div>
        </div>

        {person.email && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-semibold text-card-foreground break-all">
                {person.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
