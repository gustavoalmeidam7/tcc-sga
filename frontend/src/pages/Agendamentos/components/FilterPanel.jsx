import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Calendar, ChevronDown, ChevronUp } from "lucide-react";

function FilterPanel({
  statusOptions,
  statusFilter,
  onStatusFilterChange,
  filtrosAvancadosAbertos,
  onToggleFiltrosAvancados,
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange,
  onLimparFiltros,
  hasActiveFilters,
}) {
  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">
          Status:
        </span>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Badge
              key={option.value ?? "all"}
              variant={statusFilter === option.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5"
              onClick={() => onStatusFilterChange(option.value)}
            >
              {option.label} ({option.count})
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Button
          variant="outline"
          onClick={onToggleFiltrosAvancados}
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
          {filtrosAvancadosAbertos ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>

      {filtrosAvancadosAbertos && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Período:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => onDataInicioChange(e.target.value)}
                  placeholder="Data inicial"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => onDataFimChange(e.target.value)}
                  placeholder="Data final"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLimparFiltros}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Todos os Filtros
        </Button>
      )}
    </div>
  );
}

export default memo(FilterPanel);
