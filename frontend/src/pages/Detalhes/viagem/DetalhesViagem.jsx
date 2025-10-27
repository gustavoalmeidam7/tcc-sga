import { useRole } from "@/hooks/use-role";
import ManagerDetalhesView from "./view/manager";
import UserDetalhesView from "./view/user";

export default function DetalhesViagem() {
  const { isManager, isUser } = useRole();

  if (isManager()) return <ManagerDetalhesView />;
  if (isUser()) return <UserDetalhesView />;

  return <UserDetalhesView />;
}
