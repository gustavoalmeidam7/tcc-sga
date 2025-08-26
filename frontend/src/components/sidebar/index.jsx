import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Home,
  PanelBottom,
  Package,
  Map,
  Users,
  Info,
  LifeBuoy,
  LogIn,
  Car,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex w-full flex-col bg-gray-800">
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex items-center px-4 border-b bg-gray-800 grap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden border-0">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">Abrir / fechar menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="sm:max-w-xs bg-gray-800 text-white"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/"
                  className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                >
                  <Package className="h-5 w-5 transition-all" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <Home className="h-5 w-5 transition-all" />
                  Página Inicial
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <LogIn className="h-5 w-5 transition-all" />
                  Iniciar Sessão
                </Link>

                <Link
                  to="/viagens"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <Map className="h-5 w-5 transition-all" />
                  Viagens
                </Link>

                <Link
                  to="/ambulancias"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <Car className="h-5 w-5 transition-all" />
                  Ambulâncias
                </Link>

                <Link
                  to="/usuarios"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <Users className="h-5 w-5 transition-all" />
                  Usuários
                </Link>

                <Link
                  to="/saiba-mais"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <Info className="h-5 w-5 transition-all" />
                  Saiba Mais
                </Link>

                <Link
                  to="/suporte"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-200"
                >
                  <LifeBuoy className="h-5 w-5 transition-all" />
                  Suporte
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
