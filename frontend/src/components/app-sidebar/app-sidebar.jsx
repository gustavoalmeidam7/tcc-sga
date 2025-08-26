import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, 
} from "@components/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Login",
    url: "/login",
    icon: Inbox,
  },
  {
    title: "Viagens",
    url: "/viagens",
    icon: Calendar,
  },
  {
    title: "Ambulâncias",
    url: "/ambulancias",
    icon: Search,
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Settings,
  },
  {
    title: "Saiba Mais",
    url: "/saiba-mais",
    icon: Settings,
  },
  {
    title: "Suporte",
    url: "/suporte",
    icon: Settings,
  },
]


export default function AppSidebar() {
  return (
     <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
