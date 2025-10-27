import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function QuickActions({ onNavigate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3">
        <Button
          onClick={() => onNavigate("/ambulancias")}
          variant="secondary"
          className="text-base"
        >
          Gerenciar Ambulâncias
        </Button>
        <Button
          onClick={() => onNavigate("/usuarios")}
          variant="secondary"
          className="text-base"
        >
          Gerenciar Usuários
        </Button>
        <Button
          onClick={() => onNavigate("/agendamentos")}
          variant="secondary"
          className="text-base"
        >
          Ver Todas as Viagens
        </Button>
      </CardContent>
    </Card>
  );
}

export default memo(QuickActions);
