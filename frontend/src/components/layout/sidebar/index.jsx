import { memo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  Car,
  Home,
  Info,
  LifeBuoy,
  LogIn,
  LogOut,
  Map,
  Settings,
  Users,
  User,
  ChevronDown,
  PlusCircle,
  Calendar,
  History,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/use-role";
import { ROLES } from "@/lib/roles";
import { ThemeToggle } from "@/components/ThemeToggle";
import img_logo from "@/assets/Logo.webp";

const navItems = [
  {
    to: "/home",
    icon: Home,
    label: "Página Inicial",
    roles: [ROLES.USER, ROLES.DRIVER, ROLES.MANAGER],
  },
  {
    label: "Viagens",
    icon: Map,
    roles: [ROLES.USER, ROLES.DRIVER, ROLES.MANAGER],
    subItems: [
      {
        to: "/viagens",
        icon: PlusCircle,
        label: "Nova Viagem",
        roles: [ROLES.USER],
      },
      {
        to: "/agendamentos",
        icon: Calendar,
        label: "Meus Agendamentos",
        roles: [ROLES.USER],
      },
      {
        to: "/agendamentos",
        icon: Calendar,
        label: "Painel de Viagens",
        roles: [ROLES.MANAGER],
      },
      {
        to: "/historico",
        icon: History,
        label: "Histórico",
        roles: [ROLES.USER, ROLES.DRIVER, ROLES.MANAGER],
      },
    ],
  },
  {
    to: "/ambulancias",
    icon: Car,
    label: "Ambulâncias",
    roles: [ROLES.DRIVER, ROLES.MANAGER],
  },
  { to: "/usuarios", icon: Users, label: "Usuários", roles: [ROLES.MANAGER] },
];

const publicNavItems = [
  { to: "/", icon: Home, label: "Landing Page" },
  { to: "/saiba-mais", icon: Info, label: "Saiba Mais" },
  { to: "/suporte", icon: LifeBuoy, label: "Suporte" },
];

const Logo = () => {
  return (
    <SidebarHeader className="p-4">
      <Link
        to="/home"
        className="flex items-center gap-3"
        aria-label="SGA - Sistema de Gestão de Ambulâncias - Ir para página inicial"
      >
        <img
          src={img_logo}
          alt="SGA Logo"
          className="h-12 w-auto object-contain"
        />
        <span className="font-bold text-xl text-primary">SGA</span>
      </Link>
    </SidebarHeader>
  );
};

const NavMenuItem = ({ item, pathname, ItemView }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.subItems) {
    const ItemsVisiveis = item.subItems.filter((subItem) => ItemView(subItem));

    if (ItemsVisiveis.length === 0) return null;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              className="h-9"
              aria-expanded={isOpen}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-base">{item.label}</span>
              <ChevronDown
                className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {ItemsVisiveis.map((subItem) => (
                <SidebarMenuSubItem key={subItem.to}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.to}
                  >
                    <Link to={subItem.to}>
                      <subItem.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{subItem.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <Link to={item.to} className="w-full">
        <SidebarMenuButton
          isActive={pathname === item.to}
          tooltip={item.label}
          className="h-9"
        >
          <item.icon className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium text-base">{item.label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <SidebarFooter className="p-2 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="group/user-profile flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent"
            aria-label={`Menu de ${user?.nome || "usuário"}`}
          >
            <User className="text-background-foreground" aria-hidden="true" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-base font-medium">
                {user?.nome}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-45" align="end" forceMount>
          <DropdownMenuItem onClick={() => navigate("/perfil")}>
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
};

export const AppSidebar = memo(function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { userRole } = useRole();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const ItemView = (item) => {
    if (!item.roles) return true;
    if (userRole === null) return false;
    return item.roles.includes(userRole);
  };

  const renderNavItems = (items) =>
    items
      .filter((item) => ItemView(item))
      .map((item) => (
        <NavMenuItem
          key={item.to || item.label}
          item={item}
          pathname={location.pathname}
          ItemView={ItemView}
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
                <LogIn />
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
