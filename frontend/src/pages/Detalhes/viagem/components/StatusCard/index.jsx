const STATUS_STYLES = {
  success: {
    container: "bg-green-500/10 dark:bg-green-500/20 border-green-500/30",
    text: "text-green-800 dark:text-green-400",
    icon: "text-green-700 dark:text-green-500",
  },
  warning: {
    container: "bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/30",
    text: "text-yellow-900 dark:text-yellow-400",
    icon: "text-yellow-800 dark:text-yellow-500",
  },
  info: {
    container: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30",
    text: "text-blue-800 dark:text-blue-400",
    icon: "text-blue-700 dark:text-blue-500",
  },
  default: {
    container: "bg-muted/30 border-border",
    text: "text-muted-foreground",
    icon: "text-muted-foreground",
  },
};

export const StatusCard = ({
  icon: Icon,
  title,
  status,
  statusType = "info",
  children,
}) => {
  const styles = STATUS_STYLES[statusType] || STATUS_STYLES.default;

  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`h-5 w-5 mt-0.5 ${styles.icon}`} />
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-sm font-medium mt-1 text-foreground">{status}</p>
        </div>
      </div>
      {children}
    </div>
  );
};
