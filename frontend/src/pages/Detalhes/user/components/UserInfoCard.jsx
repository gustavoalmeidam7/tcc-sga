import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetailItem = ({ icon: Icon, label, value, iconColor = "text-primary" }) => (
  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
    <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-background/50">
      <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-base font-medium text-foreground break-words">
        {value || "Não informado"}
      </p>
    </div>
  </div>
);

export const UserInfoCard = ({ title, icon: TitleIcon, items }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TitleIcon className="h-5 w-5 text-primary" aria-hidden="true" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.map((item, index) => (
        <DetailItem key={index} {...item} />
      ))}
    </CardContent>
  </Card>
);
