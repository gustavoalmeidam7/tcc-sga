import { memo } from "react";

const DetailCardComponent = ({
  icon: Icon,
  label,
  value,
  description,
  className = "",
}) => (
  <div
    className={`group relative rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md ${className}`}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-base font-semibold text-card-foreground break-words">
          {value}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const DetailCard = memo(DetailCardComponent);
