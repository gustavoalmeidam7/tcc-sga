import { cn } from '@/lib/utils';

const LoadingSpinner = ({
  size = 'default',
  className = '',
  fullScreen = false,
  text = null,
  variant = 'primary',
  inline = false
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    small: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const classesVariaveis = {
    primary: 'border-muted border-t-primary',
    secondary: 'border-muted border-t-secondary',
    success: 'border-muted border-t-chart-3',
    danger: 'border-muted border-t-destructive',
    warning: 'border-muted border-t-chart-4',
  };

  const spinner = (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        classesVariaveis[variant]
      )}
      role="status"
      aria-label="Carregando..."
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (inline) {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        {spinner}
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-4">
        {spinner}
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ colSpan = 5 }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </div>
      </td>
    </tr>
  );
};

export default LoadingSpinner;