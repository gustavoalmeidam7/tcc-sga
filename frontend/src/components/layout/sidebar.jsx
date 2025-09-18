import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarSeparator, } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Car, Home, Info, LifeBuoy, LogIn, Map, Package2, Users, ChevronUp, LogOut, } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/home", icon: Home, label: "Página Inicial" },
  { to: "/viagens", icon: Map, label: "Viagens" },
  { to: "/ambulancias", icon: Car, label: "Ambulâncias" },
  { to: "/usuarios", icon: Users, label: "Usuários" },
  { to: "/saiba-mais", icon: Info, label: "Saiba Mais" },
  { to: "/suporte", icon: LifeBuoy, label: "Suporte" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center h-10">
          <Package2 className="h-6 w-6" />
          <span className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            SGA
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-1.5">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link to={item.to} className="w-full">
                <SidebarMenuButton
                  isActive={location.pathname === item.to}
                  tooltip={item.label}
                  className="h-9 md:h-9"
                >
                  <item.icon/>
                  <span className="text-base font-medium">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {!isAuthenticated && (
            <SidebarMenuItem>
              <Link to="/login" className="w-full">
                <SidebarMenuButton
                  isActive={location.pathname === "/login"}
                  tooltip="Iniciar Sessão"
                  className="h-9 md:h-9"
                >
                  <LogIn/>
                  <span className="text-base font-medium">Iniciar Sessão</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter>
          <SidebarSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-1 pl-2 cursor-pointer">
                <span className="text-lg md:text-base">{user?.username}</span>
                <ChevronUp className="ml-auto"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              <DropdownMenuItem>Editar conta</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}> <LogOut /> Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}