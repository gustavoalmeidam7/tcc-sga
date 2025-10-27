import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

function DataTablesTabs({
  viagensPendentesPreview,
  viagensPendentesTotal,
  motoristas,
  columnsViagens,
  columnsMotoristas,
  onVerTodasClick,
  isLoadingData = false,
}) {
  return (
    <Card className="lg:col-span-2 p-5">
      <Tabs defaultValue="viagens">
        <TabsList className="bg-transparent rounded-none p-0 h-auto w-full sm:w-auto sm:justify-start">
          <TabsTrigger
            value="viagens"
            className="text-xs sm:text-base data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary flex-1 sm:flex-initial whitespace-nowrap px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Viagens Pendentes</span>
            <span className="sm:hidden text-sm">Viagens</span>
          </TabsTrigger>
          <TabsTrigger
            value="motoristas"
            className="text-xs sm:text-base data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary flex-1 sm:flex-initial whitespace-nowrap px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Motoristas Ativos</span>
            <span className="sm:hidden text-sm">Motoristas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viagens" className="mt-4">
          <DataTable
            key="viagens"
            columns={columnsViagens}
            data={viagensPendentesPreview}
            filterColumn="_endereco_origem"
            filterPlaceholder="Filtrar por origem..."
            isLoading={isLoadingData}
          />
          {!isLoadingData && viagensPendentesTotal > 5 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={onVerTodasClick}
                variant="outline"
                className="text-base"
              >
                Ver Todas as Viagens ({viagensPendentesTotal})
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="motoristas" className="mt-4">
          <DataTable
            key="motoristas"
            columns={columnsMotoristas}
            data={motoristas}
            filterColumn="nome"
            filterPlaceholder="Filtrar por nome..."
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default memo(DataTablesTabs);
