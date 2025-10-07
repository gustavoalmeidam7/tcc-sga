import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TextAnimate } from "@/components/ui/text-animate";
import { MapPin, Calendar } from "lucide-react";

export default function UserView() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          <p className="text-muted-foreground">Gerencie suas viagens de ambulancia.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer hover:border-primary transition-all"
          onClick={() => navigate('/viagens')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nova Viagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Solicite uma nova viagem de ambulancia
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary transition-all"
          onClick={() => navigate('/agendamentos')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Meus Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visualize e gerencie suas viagens agendadas
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
