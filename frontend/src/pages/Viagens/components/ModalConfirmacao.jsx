import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Navigation, User, Calendar, Clock } from "lucide-react";
import { formatarData } from "@/lib/date-utils";
import { motion } from "framer-motion";

export function ModalConfirmacao({
  open,
  onOpenChange,
  dadosViagem
}) {
  if (!dadosViagem) return null;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                delay: 0.3
              }}
            >
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DialogTitle className="text-center text-xl">
              Viagem Confirmada!
            </DialogTitle>
            <DialogDescription className="text-center">
              A ambulância foi solicitada com sucesso.
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="space-y-3 py-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="flex items-start gap-3"
          >
            <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Paciente</p>
              <p className="text-sm text-muted-foreground">{dadosViagem.nomePaciente}</p>
              <p className="text-xs text-muted-foreground">{dadosViagem.cpfPaciente}</p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="flex items-start gap-3"
          >
            <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Data e Hora</p>
              <p className="text-sm text-muted-foreground">
                {formatarData(`${dadosViagem.dataAgendamento}T${dadosViagem.horaAgendamento}:00`)} às {dadosViagem.horaAgendamento}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="flex items-start gap-3"
          >
            <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Origem</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{dadosViagem.origem}</p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="flex items-start gap-3"
          >
            <Navigation className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Destino</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{dadosViagem.destino}</p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="flex items-start gap-3"
          >
            <Clock className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Duração Estimada</p>
              <p className="text-sm text-muted-foreground">
                {dadosViagem.distancia} km • {dadosViagem.duracao} min
              </p>
            </div>
          </motion.div>
        </motion.div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}