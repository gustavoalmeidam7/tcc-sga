import { useRole } from "@/hooks/use-role";
import { ROLES } from "@/lib/roles";
import ManagerView from "./view/manager";
import DriverView from "./view/driver";
import { motion } from "framer-motion";
import { Ambulance as AmbulanceIcon } from "lucide-react";

export default function Ambulancias() {
  const { isManager, isDriver, isUser } = useRole();

  if (isUser()) {
    return (
      <main className="space-y-4 lg:space-y-5 lg:container lg:mx-auto pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <AmbulanceIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acesso Negado
          </h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </motion.div>
      </main>
    );
  }

  if (isManager()) return <ManagerView />;
  if (isDriver()) return <DriverView />;

  return <ManagerView />;
}
