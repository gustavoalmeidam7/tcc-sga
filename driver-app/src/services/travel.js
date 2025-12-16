import API from "./api.js";
import driverService from "./driver.js";
import ambulanceService from "./ambulance.js";
import { AmbulanceStatus } from "../lib/ambulance.js";

const getAssignedTravels = async (
  page = 0,
  pageSize = 15,
  canceled = false
) => {
  const response = await API.get("/travel/assigned/", {
    params: { page, pageSize, canceled },
  });
  return response.data;
};

const getTravelById = async (id) => {
  const response = await API.get(`/travel/${id}`);
  return response.data;
};

const startTravel = async (id) => {
  // 1. Inicia viagem no backend (Crítico)
  const response = await API.post(`/travel/start/${id}`);

  // 2. Atualiza motorista (Não crítico - falha silenciosa para o usuário, mas logada)
  try {
    await driverService.updateDriver({ em_viagem: true });
  } catch (error) {
    console.error(
      "[TravelService] FALHA ao atualizar status do motorista:",
      error
    );
    // TODO: Implementar fila de retry ou sincronização periódica
  }

  // 3. Atualiza ambulância (Não crítico)
  try {
    const travel = await getTravelById(id);
    if (travel && travel.id_ambulancia) {
      const ambulance = await ambulanceService.getAmbulanceById(
        travel.id_ambulancia
      );
      await ambulanceService.updateAmbulance(travel.id_ambulancia, {
        status: AmbulanceStatus.IN_USE,
        tipo: ambulance.tipo,
      });
    }
  } catch (error) {
    console.error(
      "[TravelService] FALHA ao sincronizar status da ambulância:",
      error
    );
  }

  return response.data;
};

const endTravel = async (id) => {
  const response = await API.post(`/travel/end/${id}`);

  // Tenta atualizar status do motorista e ambulância, mas não falha se der erro
  try {
    await driverService.updateDriver({ em_viagem: false });
  } catch (error) {
    console.warn(
      "Aviso: Não foi possível atualizar status do motorista automaticamente:",
      error.message
    );
  }

  try {
    const travel = await getTravelById(id);
    if (travel && travel.id_ambulancia) {
      const ambulance = await ambulanceService.getAmbulanceById(
        travel.id_ambulancia
      );
      await ambulanceService.updateAmbulance(travel.id_ambulancia, {
        status: AmbulanceStatus.ACTIVE,
        tipo: ambulance.tipo,
      });
    }
  } catch (error) {
    console.warn(
      "Aviso: Não foi possível atualizar status da ambulância automaticamente:",
      error.message
    );
  }

  return response.data;
};

const cancelTravel = async (id) => {
  const response = await API.post(`/travel/cancel/${id}`);
  return response.data;
};

const travelService = {
  getAssignedTravels,
  getTravelById,
  startTravel,
  endTravel,
  cancelTravel,
};

export default travelService;
