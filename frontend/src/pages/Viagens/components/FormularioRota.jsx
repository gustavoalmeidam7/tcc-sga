import { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  Route,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "./AutocompleteInput";
import { useGeocodingAutocomplete } from "../hooks/useGeocodingAutocomplete";

function FormularioRotaComponent({
  origem,
  destino,
  setOrigem,
  setDestino,
  setCoordOrigem,
  setCoordDestino,
  distancia,
  duracao,
  rota,
  error,
  onAvancar,
}) {
  const origemAutocomplete = useGeocodingAutocomplete();
  const destinoAutocomplete = useGeocodingAutocomplete();

  const handleOrigemChange = (e) => {
    setOrigem(e.target.value);
    origemAutocomplete.handleInputChange(e.target.value);
  };

  const handleDestinoChange = (e) => {
    setDestino(e.target.value);
    destinoAutocomplete.handleInputChange(e.target.value);
  };

  const selecionarOrigem = (sugestao) => {
    setOrigem(sugestao.nome);
    setCoordOrigem([sugestao.lat, sugestao.lon]);
  };

  const selecionarDestino = (sugestao) => {
    setDestino(sugestao.nome);
    setCoordDestino([sugestao.lat, sugestao.lon]);
  };

  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="border-2 hover:border-primary/50 transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Route className="h-5 w-5 text-primary" />
            Defina a Rota
          </CardTitle>
          <CardDescription>Digite origem e destino da viagem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AutocompleteInput
            id="origem"
            label="Origem"
            icon={MapPin}
            iconColor="text-green-500"
            placeholder="Ex: São Carlos, SP, Brasil"
            value={origem}
            onChange={handleOrigemChange}
            onKeyDown={(e) =>
              origemAutocomplete.handleKeyDown(e, selecionarOrigem)
            }
            onFocus={() => origemAutocomplete.setShowSugestoes(true)}
            sugestoes={origemAutocomplete.sugestoes}
            showSugestoes={origemAutocomplete.showSugestoes}
            onSugestaoClick={(sug) =>
              origemAutocomplete.handleSugestaoClick(sug, selecionarOrigem)
            }
            inputRef={origemAutocomplete.inputRef}
            borderColor="focus:border-green-500"
          />

          <AutocompleteInput
            id="destino"
            label="Destino"
            icon={Navigation}
            iconColor="text-red-500"
            placeholder="Ex: Araraquara, SP, Brasil"
            value={destino}
            onChange={handleDestinoChange}
            onKeyDown={(e) =>
              destinoAutocomplete.handleKeyDown(e, selecionarDestino)
            }
            onFocus={() => destinoAutocomplete.setShowSugestoes(true)}
            sugestoes={destinoAutocomplete.sugestoes}
            showSugestoes={destinoAutocomplete.showSugestoes}
            onSugestaoClick={(sug) =>
              destinoAutocomplete.handleSugestaoClick(sug, selecionarDestino)
            }
            inputRef={destinoAutocomplete.inputRef}
            borderColor="focus:border-red-500"
          />
        </CardContent>
      </Card>

      <AnimatePresence>
        {rota.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30">
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <Route className="h-5 w-5 mx-auto text-primary" />
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      {distancia}
                    </p>
                    <p className="text-xs text-muted-foreground">km</p>
                  </div>
                  <div className="space-y-1">
                    <Clock className="h-5 w-5 mx-auto text-orange-500" />
                    <p className="text-xl md:text-2xl font-bold text-orange-500">
                      {duracao}
                    </p>
                    <p className="text-xs text-muted-foreground">min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {rota.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={onAvancar}
            className="w-full h-12 md:h-14 text-base md:text-lg font-bold text-accent-foreground"
            size="lg"
          >
            Avançar para Dados do Paciente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 md:p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          <span className="text-sm md:text-base">{error}</span>
        </motion.div>
      )}
    </div>
  );
}

export const FormularioRota = memo(FormularioRotaComponent);
