import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              to="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center"
            >
              <Package className="h-4 w-4" />
              <span className="sr-only">Logo do projeto</span>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Página Inicial</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right"> Página Inicial </TooltipContent>
            </Tooltip>

          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 p-1 flex items-center px-3 border-b bg-gray-800 grap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden border-0"
              >
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
                  className="flex h-10 w-10 rounded-full text-lg items-center justify-center md:text-base gap-2"
                >
                  <Package className="h-5 w-5 transition-all" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <Home className="h-5 w-5 transition-all" />
                  Página Inicial
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <LogIn className="h-5 w-5 transition-all" />
                  Iniciar Sessão
                </Link>

                <Link
                  to="/viagens"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <Map className="h-5 w-5 transition-all" />
                  Viagens
                </Link>

                <Link
                  to="/ambulancias"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <Car className="h-5 w-5 transition-all" />
                  Ambulâncias
                </Link>

                <Link
                  to="/usuarios"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <Users className="h-5 w-5 transition-all" />
                  Usuários
                </Link>

                <Link
                  to="/saiba-mais"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <Info className="h-5 w-5 transition-all" />
                  Saiba Mais
                </Link>

                <Link
                  to="/suporte"
                  className="flex items-center gap-4 px-2.5 hover:text-gray-300"
                >
                  <LifeBuoy className="h-5 w-5 transition-all" />
                  Suporte
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <h3 className="text-base margin m-px">Menu</h3>
        </header>
      </div>
    </div>
  );
}
