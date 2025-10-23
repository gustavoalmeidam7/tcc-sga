import { useRole } from "@/hooks/use-role";
import ManagerView from "./view/manager";
import UserView from "./view/user";
import DriverView from "./view/driver";

export default function Home() {
  const { isManager, isDriver, isUser } = useRole();

  if (isManager()) return <ManagerView />;
  if (isDriver()) return <DriverView />;
  if (isUser()) return <UserView />;

  return <UserView />;
}