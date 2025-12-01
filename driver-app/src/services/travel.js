import API from "./api.js";
import driverService from "./driver.js";
import ambulanceService from "./ambulance.js";
import { AmbulanceStatus } from "../lib/ambulance.js";

const getAssignedTravels = async (page = 0, pageSize = 15, canceled = false) => {
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
  const response = await API.post(`/travel/start/${id}`);

  try {
    await driverService.updateDriver({ em_viagem: true });

    const travel = await getTravelById(id);
    if (travel && travel.id_ambulancia) {
      const ambulance = await ambulanceService.getAmbulanceById(travel.id_ambulancia);
      await ambulanceService.updateAmbulance(travel.id_ambulancia, {
        status: AmbulanceStatus.IN_USE,
        tipo: ambulance.tipo,
      });
    }
  } catch (error) {
    console.error("Erro ao sincronizar status (startTravel):", error);
  }

  return response.data;
};

const endTravel = async (id) => {
  const response = await API.post(`/travel/end/${id}`);

  try {
    await driverService.updateDriver({ em_viagem: false });

    const travel = await getTravelById(id);
    if (travel && travel.id_ambulancia) {
      const ambulance = await ambulanceService.getAmbulanceById(travel.id_ambulancia);
      await ambulanceService.updateAmbulance(travel.id_ambulancia, {
        status: AmbulanceStatus.ACTIVE,
        tipo: ambulance.tipo,
      });
    }
  } catch (error) {
    console.error("Erro ao sincronizar status (endTravel):", error);
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
