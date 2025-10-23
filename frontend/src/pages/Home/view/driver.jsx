import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { TextAnimate } from "@/components/ui/text-animate";
import { Truck, Clock } from "lucide-react";
import { getTravels } from "@/services/travelService";

export default function DriverView() {
  const { user } = useAuth();

  const { data: travels = [] } = useQuery({
    queryKey: ['travels', 'driver', user?.id],
    queryFn: () => getTravels(100, 0),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const viagensAtribuidas = useMemo(
    () => travels.filter(t =>
      t.id_motorista === user?.id &&
      (t.realizado === 0 || t.realizado === 1)
    ),
    [travels, user?.id]
  );

  const viagensConcluidasHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return travels.filter(t => {
      if (t.id_motorista !== user?.id || t.realizado !== 2) return false;

      const fimViagem = new Date(t.fim);
      fimViagem.setHours(0, 0, 0, 0);

      return fimViagem.getTime() === hoje.getTime();
    });
  }, [travels, user?.id]);

  return (
    <main className="space-y-6 lg:container lg:mx-auto">
      <header className="flex flex-col gap-4">
        <div>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            delay={0.15}
            className="text-xl md:text-2xl font-bold text-foreground"
          >
            {`Bem-vindo, ${user?.nome || ''}!`}
          </TextAnimate>
          <p className="text-muted-foreground">Dashboard do motorista.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Viagens Atribuidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{viagensAtribuidas.length}</p>
            <p className="text-muted-foreground text-sm">viagens pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Viagens Concluidas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-500">{viagensConcluidasHoje.length}</p>
            <p className="text-muted-foreground text-sm">viagens completadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Dashboard do motorista estara disponivel em breve.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
