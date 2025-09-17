import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import userAvatar from "@/assets/avatar.webp";
import { Briefcase, Ambulance, User, Activity } from "lucide-react";
import { ViagensDoDiaModal } from "@/components/modals/ViagensDia";
import { AmbulanciasLivresModal } from "@/components/modals/AmbulanciasLivres";
import { MotoristasAtivosModal } from "@/components/modals/MotoristasAtivos";
import { ChamadosPendentesModal } from "@/components/modals/ChamadosPendentes";
import { TextAnimate } from "@/components/ui/text-animate";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="w-full min-h-screen p-4 sm:p-8">
      <section className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={userAvatar} alt="Foto do gestor" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div>
              <TextAnimate
                animation="blurInUp" by="character" once delay={0.15} className="text-base sm:text-2xl font-bold text-foreground">
                {user ? `Bem-vindo, ${user.username}` : `Bem-vindo!`}
              </TextAnimate>
              <p className="text-sm text-muted-foreground">Painel de controle</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="shadow-md border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Viagens do Dia
                  </CardTitle>
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-semibold text-foreground">12</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 novas hoje</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Viagens do Dia</DialogTitle>
                <DialogDescription>
                  Lista de todas as viagens realizadas hoje.
                </DialogDescription>
              </DialogHeader>
              <ViagensDoDiaModal />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="shadow-md border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ambulâncias Livres
                  </CardTitle>
                  <Ambulance className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-semibold text-foreground">3 de 5</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Última atualização: agora
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ambulâncias Livres</DialogTitle>
                <DialogDescription>
                  Ambulâncias disponíveis no momento.
                </DialogDescription>
              </DialogHeader>
              <AmbulanciasLivresModal />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="shadow-md border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Motoristas Ativos
                  </CardTitle>
                  <User className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-semibold text-foreground">6</div>
                  <p className="text-xs text-muted-foreground mt-1">Em serviço</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Motoristas Ativos</DialogTitle>
                <DialogDescription>
                  Motoristas atualmente em serviço.
                </DialogDescription>
              </DialogHeader>
              <MotoristasAtivosModal />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="shadow-md border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Chamados Pendentes
                  </CardTitle>
                  <Activity className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-semibold text-foreground">2</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aprovação necessária
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chamados Pendentes</DialogTitle>
                <DialogDescription>
                  Chamados que necessitam de aprovação.
                </DialogDescription>
              </DialogHeader>
              <ChamadosPendentesModal />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle>Viagens Pendentes</CardTitle>
                <CardDescription>Aprovar ou atribuir viagens</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="transition-colors">
                      <TableCell className="font-medium">001</TableCell>
                      <TableCell>Maicon</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Aprovar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="transition-colors">
                      <TableCell className="font-medium">002</TableCell>
                      <TableCell>Kaique</TableCell>
                      <TableCell>Clínica</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Aprovar
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Gerencie o sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Link to="/ambulancias">
                    <Button
                      className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
                      variant="outline"
                    >
                      Gerenciar Ambulâncias
                    </Button>
                  </Link>
                  <Link to="/usuarios">
                    <Button
                      className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
                      variant="outline"
                    >
                      Gerenciar Usuários
                    </Button>
                  </Link>
                  <Link to="/viagens">
                    <Button
                      className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
                      variant="outline"
                    >
                      Visualizar Todas as Viagens
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
