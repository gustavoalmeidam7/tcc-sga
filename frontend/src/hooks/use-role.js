import { useAuth } from './useAuth';
import { ROLES } from '@/lib/roles';

export function useRole() {
  const { user } = useAuth();

  const userRole = user?.cargo ?? null;

  const hasRole = (requiredRole) => {
    if (userRole === null) return false;
    return userRole >= requiredRole;
  };

  const isManager = () => userRole === ROLES.MANAGER;
  const isDriver = () => userRole === ROLES.DRIVER;
  const isUser = () => userRole === ROLES.USER;

  return {
    userRole,
    hasRole,
    isManager,
    isDriver,
    isUser,
  };
}
