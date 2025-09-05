import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
import userAvatar from "@/assets/avatar.png";
import { Briefcase, Ambulance, User, Activity, Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gray-50 p-4 sm:p-8">
      <section className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={userAvatar} alt="Foto do gestor" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bem-vindo, Maicon</h1>
              <p className="text-sm text-gray-600">Painel de controle</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                Viagens do Dia
              </CardTitle>
              <Briefcase className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-semibold">12</div>
              <p className="text-xs text-gray-500 mt-1">+2 novas hoje</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                Ambulâncias Livres
              </CardTitle>
              <Ambulance className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-semibold">3 de 5</div>
              <p className="text-xs text-gray-500 mt-1">Última atualização: agora</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                Motoristas Ativos
              </CardTitle>
              <User className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-semibold">6</div>
              <p className="text-xs text-gray-500 mt-1">Em serviço</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                Chamados Pendentes
              </CardTitle>
              <Activity className="w-5 h-5 text-gray-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-semibold">2</div>
              <p className="text-xs text-gray-500 mt-1">Aprovação necessária</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle>Viagens Pendentes</CardTitle>
                <CardDescription>
                  Aprovar ou atribuir viagens
                </CardDescription>
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
                    <TableRow className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-colors">
                      <TableCell className="font-medium">001</TableCell>
                      <TableCell>Maicon</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
                          Aprovar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-colors">
                      <TableCell className="font-medium">002</TableCell>
                      <TableCell>Kaique</TableCell>
                      <TableCell>Clínica</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
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
                    <Button className="w-full hover:bg-gray-200 transition-colors" variant="outline">
                      Gerenciar Ambulâncias
                    </Button>
                  </Link>
                  <Link to="/usuarios">
                    <Button className="w-full hover:bg-gray-200 transition-colors" variant="outline">
                      Gerenciar Usuários
                    </Button>
                  </Link>
                  <Link to="/viagens">
                    <Button className="w-full hover:bg-gray-200 transition-colors" variant="outline">
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