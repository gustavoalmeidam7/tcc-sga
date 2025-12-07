export const InfoRow = ({ icon: Icon, label, value, badge }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
    {Icon && (
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-card-foreground mt-0.5">{value}</p>
    </div>
    {badge && badge}
  </div>
);
