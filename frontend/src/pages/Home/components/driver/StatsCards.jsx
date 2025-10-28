import { Card, CardContent } from "@/components/ui/card";
import { Truck, Clock, CheckCircle, Navigation } from "lucide-react";
import { memo } from "react";

const StatCard = memo(({ icon: Icon, value, label, color, bgColor }) => (
  <Card className="hover:shadow-lg transition-all">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-4 ${bgColor} rounded-xl`}>
          <Icon className={`h-8 w-8 ${color}`} aria-hidden="true" />
        </div>
      </div>
    </CardContent>
  </Card>
));

export const StatsCards = memo(({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
    <StatCard
      icon={Truck}
      value={stats.atribuidas}
      label="Atribuídas"
      color="text-primary"
      bgColor="bg-primary/10"
    />
    <StatCard
      icon={CheckCircle}
      value={stats.concluidas}
      label="Concluídas Hoje"
      color="text-green-600"
      bgColor="bg-green-500/10"
    />
    <StatCard
      icon={Clock}
      value={stats.hoje}
      label="Viagens Hoje"
      color="text-orange-600"
      bgColor="bg-orange-500/10"
    />
    <StatCard
      icon={Navigation}
      value={stats.ativa ? "1" : "0"}
      label="Viagem Ativa"
      color="text-blue-600"
      bgColor="bg-blue-500/10"
    />
  </div>
));
