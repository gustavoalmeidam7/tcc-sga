import { memo } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown,Car, Home, Info, LifeBuoy, LogIn, LogOut, Map, Settings, Users, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { to: "/home", icon: Home, label: "Página Inicial" },
  { to: "/viagens", icon: Map, label: "Viagens" },
  { to: "/ambulancias", icon: Car, label: "Ambulâncias" },
  { to: "/usuarios", icon: Users, label: "Usuários" },
];
  
const publicNavItems = [
  { to: "/", icon: Home, label: "Landing Page" },
  { to: "/saiba-mais", icon: Info, label: "Saiba Mais" },
  { to: "/suporte", icon: LifeBuoy, label: "Suporte" },
];


const Logo = () => (
  <SidebarHeader className="p-4">
      <Link to="/home" className="flex items-center gap-3" title="SGA - Início">
      <h1>Logo</h1>
      </Link>
  </SidebarHeader>
);

const NavMenuItem = ({ item, pathname }) => (
  <SidebarMenuItem>
    <Link to={item.to} className="w-full">
      <SidebarMenuButton
        isActive={pathname === item.to}
        tooltip={item.label}
        className="h-9"
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium text-base">{item.label}</span>
      </SidebarMenuButton>
    </Link>
  </SidebarMenuItem>
);

const UserProfile = ({ user, onLogout }) => (
  <SidebarFooter className="p-2 border-t">
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="group/user-profile flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent">
          <User className="text-background-foreground" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-base font-medium">{user?.nome}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-45" align="end" forceMount>
        <DropdownMenuItem >
            <Settings className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
);

export const AppSidebar = memo(function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderNavItems = (items) =>
    items.map((item) => (
      <NavMenuItem
        key={item.to}
        item={item}
        pathname={location.pathname}
      />
    ));

  return (
    <Sidebar>
      <Logo />
      <SidebarContent className="p-2">
        <SidebarMenu className="flex flex-col gap-1">
          {isAuthenticated
            ? renderNavItems(navItems)
            : renderNavItems(publicNavItems)}
        </SidebarMenu>

        <div className="mt-auto flex flex-col gap-1">
          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2 px-2">
              <Link to="/suporte" className="flex-1">
                <SidebarMenuButton
                  isActive={location.pathname === "/suporte"}
                  className="h-9 w-full justify-start"
                >
                  <LifeBuoy className="h-5 w-5" />
                  <span className="font-medium text-base">Suporte</span>
                </SidebarMenuButton>
              </Link>
              <ThemeToggle />
            </div>
          ) : (
            <Link to="/login" className="w-full">
              <SidebarMenuButton
                isActive={location.pathname === "/login"}
                className="h-9"
              >
                <LogIn/>
                <span className="text-base font-medium">Iniciar Sessão</span>
              </SidebarMenuButton>
            </Link>
          )}
        </div>
      </SidebarContent>

      {isAuthenticated && <UserProfile user={user} onLogout={handleLogout} />}
    </Sidebar>
  );
});
