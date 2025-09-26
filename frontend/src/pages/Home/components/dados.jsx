import { Activity, User, Car } from "lucide-react";

export const recentActivities = [
  {
    icon: <Car className="h-4 w-4 text-chart-4" />,
    bgColor: "bg-chart-4/20",
    text: (
      <>
        Viagem para <span className="font-semibold text-foreground">Hospital Municipal</span> iniciada.
      </>
    ),
  },
  {
    icon: <User className="h-4 w-4 text-primary" />,
    bgColor: "bg-primary/20",
    text: (
      <>
        Novo usuário <span className="font-semibold text-foreground">Erik</span> cadastrado.
      </>
    ),
  },
  {
    icon: <Activity className="h-4 w-4 text-destructive" />,
    bgColor: "bg-destructive/20",
    text: (
      <>
        Ambulância <span className="font-semibold text-foreground">ABC-1234</span> em manutenção.
      </>
    ),
  },
];

export const viagensData = [
  {
    id: "1",
    paciente: "Maicon Rodrigues",
    destino: "Hospital Municipal",
    status: "Aguardando",
  },
  {
    id: "2",
    paciente: "Marjorie Cristina",
    destino: "Santa Casa",
    status: "Aguardando",
  },
];

export const motoristasData = [
  {
    id: "1",
    nome: "Gustavo Almeida",
    status: "Ativo",
    ambulancia: "BRA-1A23",
  },
  {
    id: "2",
    nome: "Ezequias Jorge",
    status: "Ativo",
    ambulancia: "BRA-4B56",
  },
  {
    id: "3",
    nome: "Kaique Goten",
    status: "Inativo",
    ambulancia: "-",
  },
];
