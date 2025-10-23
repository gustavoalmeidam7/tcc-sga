import { Card, CardContent } from "@/components/ui/card";
import { MapPin, User, CheckCircle2, ChevronRight } from "lucide-react";

export function ProgressIndicator({ telaAtual }) {
  return (
    <Card className="py-2">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                telaAtual >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <span className="text-xs md:text-sm font-medium hidden sm:inline">
              Rota
            </span>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                telaAtual >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <span className="text-xs md:text-sm font-medium hidden sm:inline">
              Dados
            </span>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                telaAtual >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <span className="text-xs md:text-sm font-medium hidden sm:inline">
              Confirmar
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
