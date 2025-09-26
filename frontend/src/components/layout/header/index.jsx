import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    let title = 'Dashboard';

    const findTitle = (routes) => {
      for (const route of routes) {
        if (route.path === location.pathname) {
          if (route.label) return route.label; 
          const pathSegment = location.pathname.split('/').pop();
          if (pathSegment) return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
        }
        if (route.children) {
          const childTitle = findTitle(route.children);
          if (childTitle) return childTitle;
        }
      }
      return null;
    };

    const foundTitle = findTitle(appRoutes);
    if (foundTitle) title = foundTitle;

    return title;
  };

  const currentPageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-glass-border bg-glass-bg/80 px-6 backdrop-blur-lg">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{currentPageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <Avatar className="h-9 w-9 border border-glass-border">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-glass-bg border-glass-border">
            <DropdownMenuItem className="hover:bg-white/5">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-white/5">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}