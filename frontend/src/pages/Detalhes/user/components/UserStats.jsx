import { Card, CardContent } from "@/components/ui/card";

export const StatsCard = ({ icon: Icon, label, value, color }) => (
  <Card className="hover:shadow-md transition-all">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold text-${color}`}>{value}</p>
        </div>
        <div className={`p-3 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} aria-hidden="true" />
        </div>
      </div>
    </CardContent>
  </Card>
);
