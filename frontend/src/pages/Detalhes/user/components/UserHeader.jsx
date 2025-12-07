import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from "lucide-react";

const cargoLabels = {
  0: { label: "Usuário", color: "bg-blue-500" },
  1: { label: "Motorista", color: "bg-green-500" },
  2: { label: "Gerente", color: "bg-purple-500" },
};

export const UserHeader = ({ usuario, idade }) => {
  const cargo = cargoLabels[usuario?.cargo] || cargoLabels[0];

  return (
    <Card className="overflow-hidden">
      <div
        className={`h-24 ${cargo.color} bg-gradient-to-r from-${cargo.color} to-${cargo.color}/70`}
      />
      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-10">
          <div className="relative">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center">
              <User
                className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <Badge
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${cargo.color} text-white shadow-lg`}
            >
              {cargo.label}
            </Badge>
          </div>

          <div className="flex-1 space-y-2 sm:ml-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {usuario?.nome}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {idade && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {idade} anos
                </span>
              )}
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {usuario?.email}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
