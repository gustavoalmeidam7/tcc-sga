import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Ambulance, Clock, CheckCircle2 } from "lucide-react";

function RecentActivity({ motoristas = [], viagensPendentes = [] }) {
  const motoristasEmViagem = motoristas.filter(
    (m) => m.driverInfo?.em_viagem
  ).length;

  const motoristasDisponiveis = motoristas.filter(
    (m) => !m.driverInfo?.em_viagem
  ).length;

  const viagensAguardando = viagensPendentes.length;

  const activities = [
    {
      icon: <Ambulance className="h-5 w-5 text-amber-600" />,
      bgColor: "bg-amber-100",
      text: `${motoristasEmViagem} Motorista${
        motoristasEmViagem !== 1 ? "s" : ""
      } em rota agora`,
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-100",
      text: `${viagensAguardando} Viage${
        viagensAguardando !== 1 ? "ns" : "m"
      } pendente${viagensAguardando !== 1 ? "s" : ""}`,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-100",
      text: `${motoristasDisponiveis} Motorista${
        motoristasDisponiveis !== 1 ? "s" : ""
      } disponível${motoristasDisponiveis !== 1 ? "is" : ""}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumo Operacional</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="p-3 w-12">
                  <div
                    className={`p-2 ${activity.bgColor} rounded-full w-fit flex items-center justify-center`}
                  >
                    {activity.icon}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground p-3">
                  {activity.text}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default memo(RecentActivity);
