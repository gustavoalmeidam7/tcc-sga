import { useState, useMemo, memo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  createColumnsViagens,
  columns_motoristas,
} from "../components/columns";
import { getTravels } from "@/services/travelService";
import authService from "@/services/authService";
import { AmbulanciasLivresModal } from "../components/manager/modals/AmbulanciasLivres";
import { ResumoModal } from "../components/manager/modals/Resumo";
import { TextAnimate } from "@/components/ui/text-animate";
import StatCards from "../components/manager/StatCards";
import DataTablesTabs from "../components/manager/DataTablesTabs";
import QuickActions from "../components/manager/QuickActions";
import RecentActivity from "../components/manager/RecentActivity";
import { reverseGeocode } from "@/hooks/useReverseGeocode";

function ManagerView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAmbulanciasModalOpen, setIsAmbulanciasModalOpen] = useState(false);
  const [isResumoModalOpen, setIsResumoModalOpen] = useState(false);

  const { data: travels = [], isLoading: isLoadingTravels } = useQuery({
    queryKey: ["travels"],
    queryFn: () => getTravels(15, 0),
    staleTime: 1000 * 60 * 2,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => authService.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const geocodeQueries = useQueries({
    queries: travels.flatMap((t) => [
      {
        queryKey: ["geocode", t.lat_inicio, t.long_inicio],
        queryFn: () => reverseGeocode(t.lat_inicio, t.long_inicio),
        enabled: !!(t.lat_inicio && t.long_inicio),
        staleTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["geocode", t.lat_fim, t.long_fim],
        queryFn: () => reverseGeocode(t.lat_fim, t.long_fim),
        enabled: !!(t.lat_fim && t.long_fim),
        staleTime: 1000 * 60 * 30,
      },
    ]),
  });

  const userIds = useMemo(() => {
    const ids = new Set();
    travels.forEach((t) => t.id_paciente && ids.add(t.id_paciente));
    return Array.from(ids);
  }, [travels]);

  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["user", userId],
      queryFn: () => authService.getUserById(userId),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const enrichedTravels = useMemo(() => {
    const userMap = new Map();
    userIds.forEach((id, index) => {
      if (userQueries[index]?.data) {
        userMap.set(id, userQueries[index].data);
      }
    });

    return travels.map((viagem, index) => {
      const origemIndex = index * 2;
      const destinoIndex = index * 2 + 1;

      return {
        ...viagem,
        _endereco_origem: geocodeQueries[origemIndex]?.data || null,
        _endereco_destino: geocodeQueries[destinoIndex]?.data || null,
        _solicitante: userMap.get(viagem.id_paciente)?.nome || null,
      };
    });
  }, [travels, geocodeQueries, userQueries, userIds]);

  const isLoadingData = useMemo(() => {
    if (isLoadingTravels) return true;

    const hasIncompleteData = enrichedTravels.some(
      (t) =>
        t._endereco_origem === null ||
        t._endereco_destino === null ||
        t._solicitante === null
    );

    return hasIncompleteData;
  }, [isLoadingTravels, enrichedTravels]);

  const viagensPendentes = useMemo(
    () => enrichedTravels.filter((t) => t.realizado === 0),
    [enrichedTravels]
  );

  const viagensPendentesPreview = useMemo(
    () => viagensPendentes.slice(0, 5),
    [viagensPendentes]
  );

  const motoristas = useMemo(() => users.filter((u) => u.cargo === 1), [users]);

  const columns_viagens_with_nav = useMemo(
    () => createColumnsViagens(navigate),
    [navigate]
  );

  return (
    <main className="space-y-6 lg:container lg:mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            delay={0.15}
            className="text-xl md:text-2xl font-bold text-foreground"
          >
            {`Bem-vindo, ${user?.nome || ""}!`}
          </TextAnimate>
          <p className="text-muted-foreground">
            Este é o seu centro de comando SGA.
          </p>
        </div>
        <StatCards
          motoristasCount={motoristas.length}
          travelsCount={travels.length}
          onAmbulanciasClick={() => setIsAmbulanciasModalOpen(true)}
          onResumoClick={() => setIsResumoModalOpen(true)}
        />
      </header>

      <Dialog
        open={isAmbulanciasModalOpen}
        onOpenChange={setIsAmbulanciasModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ambulâncias Livres</DialogTitle>
          </DialogHeader>
          <AmbulanciasLivresModal />
        </DialogContent>
      </Dialog>

      <Dialog open={isResumoModalOpen} onOpenChange={setIsResumoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Resumo e Estatísticas
            </DialogTitle>
          </DialogHeader>
          <ResumoModal viagens={travels} motoristas={motoristas} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataTablesTabs
          viagensPendentesPreview={viagensPendentesPreview}
          viagensPendentesTotal={viagensPendentes.length}
          motoristas={motoristas}
          columnsViagens={columns_viagens_with_nav}
          columnsMotoristas={columns_motoristas}
          onVerTodasClick={() => navigate("/agendamentos")}
          isLoadingData={isLoadingData}
        />

        <aside className="lg:col-span-1 space-y-6 flex flex-col items-center lg:items-end">
          <section className="w-full max-w-sm">
            <QuickActions onNavigate={navigate} />
          </section>

          <section className="w-full max-w-sm">
            <RecentActivity />
          </section>
        </aside>
      </div>
    </main>
  );
}

export default memo(ManagerView);
