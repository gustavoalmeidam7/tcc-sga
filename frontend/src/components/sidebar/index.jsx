import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Car,
  Home,
  Info,
  LifeBuoy,
  LogIn,
  Map,
  Package2,
  Users,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Home, label: "Página Inicial" },
  { to: "/viagens", icon: Map, label: "Viagens" },
  { to: "/ambulancias", icon: Car, label: "Ambulâncias" },
  { to: "/usuarios", icon: Users, label: "Usuários" },
  { to: "/login", icon: LogIn, label: "Iniciar Sessão" },
  { to: "/saiba-mais", icon: Info, label: "Saiba Mais" },
  { to: "/suporte", icon: LifeBuoy, label: "Suporte" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="p-1">
      <SidebarHeader>
        <div className="flex items-center h-10">
          <Package2 className="h-6 w-6" />
          <span className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            SGA
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0.5">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to} className="p-0.5">
              <Link
                to={item.to}
                className="w-full"
              >
                <SidebarMenuButton
                  isActive={location.pathname === item.to}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="p-0.5 text-base">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}