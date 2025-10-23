import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, TrendingUp, Users, Calendar, AlertCircle } from "lucide-react";

export function ResumoModal({ viagens = [], motoristas = [] }) {
  const estatisticasDia = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const viagensHoje = viagens.filter(v => {
      const dataViagem = new Date(v.inicio);
      dataViagem.setHours(0, 0, 0, 0);
      return dataViagem.getTime() === hoje.getTime();
    });

    const emAndamento = viagensHoje.filter(v => v.realizado === 1).length;
    const concluidas = viagensHoje.filter(v => v.realizado === 2).length;
    const pendentes = viagensHoje.filter(v => v.realizado === 0).length;

    return { total: viagensHoje.length, emAndamento, concluidas, pendentes };
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Resumo de Hoje
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{estatisticasDia.total}</p>
                  <p className="text-xs text-muted-foreground">Total Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticasDia.pendentes}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{estatisticasDia.emAndamento}</p>
                  <p className="text-xs text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{estatisticasDia.concluidas}</p>
                  <p className="text-xs text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Estatísticas Gerais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Viagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {estatisticasGerais.totalViagens}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticasGerais.totalPendentes} pendentes • {estatisticasGerais.totalEmAndamento} em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {estatisticasGerais.taxaConclusao}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticasGerais.totalConcluidas} de {estatisticasGerais.totalViagens} viagens concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Motoristas Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {estatisticasGerais.totalMotoristas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Motoristas disponíveis no sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Concluídas</span>
                  <span className="text-sm text-muted-foreground">
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Em Andamento</span>
                  <span className="text-sm text-muted-foreground">
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pendentes</span>
                  <span className="text-sm text-muted-foreground">
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
