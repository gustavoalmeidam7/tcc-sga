import { useState } from "react";
import {Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Ambulance, Clock} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { columns_viagens, columns_motoristas } from "../components/columns";
import { recentActivities, viagensData, motoristasData } from "../components/dados";
import { AmbulanciasLivresModal } from "../components/modals/AmbulanciasLivres";
import { ChamadosPendentesModal } from "../components/modals/ChamadosPendentes";
import { TextAnimate } from "@/components/ui/text-animate";


export default function ManagerView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAmbulanciasModalOpen, AmbulanciasModal] = useState(false);
  const [isChamadosModalOpen, ChamadosOpen] = useState(false);

  return (
    <main className="space-y-6 lg:container lg:mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <TextAnimate animation="blurInUp" by="character" once delay={0.15} className="text-xl md:text-2xl font-bold text-foreground">
            {`Bem-vindo, ${user?.nome || ''}!`}
          </TextAnimate>
          <p className="text-muted-foreground">Este é o seu centro de comando SGA.</p>
        </div>
        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          <div onClick={() => AmbulanciasModal(true)} className="cursor-pointer">
            <Card>
              <CardContent className="p-2 flex items-center space-x-2">
                <Ambulance className="h-5 w-5 md:h-6 md:w-6 text-chart-4" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-primary">2</div>
                  <div className="text-base md:text-base">Ambulâncias Livres</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div onClick={() => ChamadosOpen(true)} className="cursor-pointer">
            <Card>
              <CardContent className="p-2 flex items-center space-x-2">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-primary">2</div>
                  <div className="text-base md:text-base">Chamados Pendentes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <Dialog open={isAmbulanciasModalOpen} onOpenChange={AmbulanciasModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ambulâncias Livres</DialogTitle>
          </DialogHeader>
          <AmbulanciasLivresModal />
        </DialogContent>
      </Dialog>

      <Dialog open={isChamadosModalOpen} onOpenChange={ChamadosOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chamados Pendentes</DialogTitle>
          </DialogHeader>
          <ChamadosPendentesModal />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <Tabs defaultValue="viagens">
            <TabsList className="bg-transparent rounded-none p-0 h-auto">
              <TabsTrigger value="viagens" className="text-base data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary">Viagens Pendentes</TabsTrigger>
              <TabsTrigger value="motoristas" className="text-base data-[state=active]:bg-accent data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary">Motoristas Ativos</TabsTrigger>
            </TabsList>
            <TabsContent value="viagens" className="mt-4">
              <DataTable key="viagens" columns={columns_viagens} data={viagensData} filterColumn="paciente" filterPlaceholder="Filtrar por paciente..." />
            </TabsContent>
            <TabsContent value="motoristas" className="mt-4">
              <DataTable key="motoristas" columns={columns_motoristas} data={motoristasData} filterColumn="nome" filterPlaceholder="Filtrar por nome..." />
            </TabsContent>
          </Tabs>
        </Card>

        <aside className="lg:col-span-1 space-y-6 flex flex-col items-center lg:items-end">
          <section className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <Button onClick={() => navigate('/ambulancias')} variant="secondary" className="text-base">Gerenciar Ambulâncias</Button>
                <Button onClick={() => navigate('/usuarios')} variant="secondary" className="text-base">Gerenciar Usuários</Button>
                <Button onClick={() => navigate('/viagens')} variant="secondary" className="text-base">Visualizar Viagens</Button>
              </CardContent>
            </Card>
          </section>

          <section className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {recentActivities.map((activity, index) => (
                      <TableRow key={index} className="border-none">
                        <TableCell className="p-3">
                          <div className={`p-2 ${activity.bgColor} rounded-full w-fit`}>
                            {activity.icon}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground p-3">
                          {activity.text}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>
    </main>
  );
}
