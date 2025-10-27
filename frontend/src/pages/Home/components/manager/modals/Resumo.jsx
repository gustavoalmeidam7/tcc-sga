import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, TrendingUp, Calendar, AlertCircle } from "lucide-react";

export function ResumoModal({ viagens = [], motoristas = [] }) {
  const estatisticasDia = useMemo(() => {
    const emAndamento = viagens.filter(v => v.realizado === 1).length;
    const concluidas = viagens.filter(v => v.realizado === 2).length;
    const pendentes = viagens.filter(v => v.realizado === 0).length;

    return { total: viagens.length, emAndamento, concluidas, pendentes };
  }, [viagens]);

  const estatisticasGerais = useMemo(() => {
    const totalViagens = viagens.length;
    const totalConcluidas = viagens.filter(v => v.realizado === 2).length;
    const totalPendentes = viagens.filter(v => v.realizado === 0).length;
    const totalEmAndamento = viagens.filter(v => v.realizado === 1).length;
    const totalMotoristas = motoristas.length;

    const taxaConclusao = totalViagens > 0
      ? Math.round((totalConcluidas / totalViagens) * 100)
      : 0;

    return {
      totalViagens,
      totalConcluidas,
      totalPendentes,
      totalEmAndamento,
      totalMotoristas,
      taxaConclusao
    };
  }, [viagens, motoristas]);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-4 flex items-center gap-2 text-foreground">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Resumo Geral
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl font-bold text-primary leading-tight">{estatisticasDia.total}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600 leading-tight">{estatisticasDia.pendentes}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 leading-tight">{estatisticasDia.emAndamento}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl font-bold text-green-600 leading-tight">{estatisticasDia.concluidas}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-4 flex items-center gap-2 text-foreground">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Estatísticas Gerais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                    Total de Viagens
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {estatisticasGerais.totalViagens}
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground text-right sm:text-left sm:mt-1">
                  {estatisticasGerais.totalPendentes} pendentes • {estatisticasGerais.totalEmAndamento} em andamento
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                    Taxa de Conclusão
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {estatisticasGerais.taxaConclusao}%
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground text-right sm:text-left sm:mt-1">
                  {estatisticasGerais.totalConcluidas} de {estatisticasGerais.totalViagens} concluídas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                    Motoristas Ativos
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {estatisticasGerais.totalMotoristas}
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground text-right sm:text-left sm:mt-1">
                  Disponíveis no sistema
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-4 text-foreground">Distribuição por Status</h3>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium">Concluídas</span>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {estatisticasGerais.totalConcluidas} ({estatisticasGerais.taxaConclusao}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${estatisticasGerais.taxaConclusao}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium">Em Andamento</span>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {estatisticasGerais.totalEmAndamento} (
                    {estatisticasGerais.totalViagens > 0
                      ? Math.round((estatisticasGerais.totalEmAndamento / estatisticasGerais.totalViagens) * 100)
                      : 0}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${estatisticasGerais.totalViagens > 0
                        ? (estatisticasGerais.totalEmAndamento / estatisticasGerais.totalViagens) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium">Pendentes</span>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {estatisticasGerais.totalPendentes} (
                    {estatisticasGerais.totalViagens > 0
                      ? Math.round((estatisticasGerais.totalPendentes / estatisticasGerais.totalViagens) * 100)
                      : 0}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${estatisticasGerais.totalViagens > 0
                        ? (estatisticasGerais.totalPendentes / estatisticasGerais.totalViagens) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
