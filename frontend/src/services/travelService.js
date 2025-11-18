import API from "./api";

export const createTravel = async (travelData) => {
  try {
    const response = await API.post("/travel", {
      inicio: travelData.inicio,
      fim: travelData.fim,
      cpf_paciente: travelData.cpf_paciente,
      estado_paciente: travelData.estado_paciente,
      observacoes: travelData.observacoes || null,
      lat_inicio: travelData.lat_inicio,
      long_inicio: travelData.long_inicio,
      end_inicio: travelData.end_inicio,
      lat_fim: travelData.lat_fim,
      long_fim: travelData.long_fim,
      end_fim: travelData.end_fim,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTravels = async (viagensPorPagina = 15, pagina = 0) => {
  try {
    const response = await API.get("/travel", {
      params: {
        pageSize: viagensPorPagina,
        page: pagina,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssignedTravels = async (viagensPorPagina = 15, pagina = 0) => {
  try {
    const response = await API.get("/travel/assigned/", {
      params: {
        pageSize: viagensPorPagina,
        page: pagina,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTravelById = async (id) => {
  try {
    const response = await API.get(`/travel/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelTravel = async (id) => {
  try {
    const response = await API.post(`/travel/cancel/${id}`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignDriverToTravel = async (driverId, travelId) => {
  try {
    const response = await API.post(
      `/manager/assigndrivertravel/${driverId}/${travelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
