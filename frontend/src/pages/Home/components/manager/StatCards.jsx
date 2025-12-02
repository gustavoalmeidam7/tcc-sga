import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, CheckCircle } from "lucide-react";

function StatCards({
  motoristasCount,
  travelsCount,
  onAmbulanciasClick,
  onResumoClick,
}) {
  return (
    <div className="w-full max-w-sm grid grid-cols-2 gap-3 sm:gap-4">
      <div onClick={onAmbulanciasClick} className="cursor-pointer h-full">
        <Card className="h-full overflow-hidden">
          <CardContent className="p-2 flex items-center gap-2 h-full min-h-[50px] sm:min-h-[60px]">
            <Ambulance className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-chart-4 flex-shrink-0" />
            <div className="flex-1 min-w-0 overflow-hidden flex items-center">
              <div className="text-xs md:text-sm leading-tight break-words">
                Ambulâncias
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div onClick={onResumoClick} className="cursor-pointer h-full">
        <Card className="h-full overflow-hidden">
          <CardContent className="p-2 flex items-center gap-2 h-full min-h-[50px] sm:min-h-[60px]">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0 overflow-hidden flex items-center">
              <div className="text-xs md:text-sm leading-tight break-words">
                Ver Resumo
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(StatCards);
