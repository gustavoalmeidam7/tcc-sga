import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Ambulance, CheckCircle, User } from "lucide-react";

const recentActivities = [
  {
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    bgColor: "bg-green-100",
    text: "Viagem para Hospital Municipal concluída",
  },
  {
    icon: <User className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-blue-100",
    text: "Novo usuário Erik cadastrado",
  },
  {
    icon: <Ambulance className="h-5 w-5 text-orange-600" />,
    bgColor: "bg-red-100",
    text: "Ambulância ABC-1234 em manutenção.",
  },
];

function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {recentActivities.map((activity, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="p-3">
                  <div className={`p-2 ${activity.bgColor} rounded-full w-fit`}>
                    {activity.icon}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground p-3">
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
