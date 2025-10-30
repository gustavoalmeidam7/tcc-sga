import API from './api';

export const createTravel = async (travelData) => {
  try {
    const response = await API.post('/travel', {
      inicio: travelData.inicio,
      fim: travelData.fim,
      lat_inicio: travelData.lat_inicio,
      long_inicio: travelData.long_inicio,
      lat_fim: travelData.lat_fim,
      long_fim: travelData.long_fim,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTravels = async (viagensPorPagina = 15, pagina = 0) => {
  try {
    const response = await API.get('/travel', {
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
    const response = await API.get('/travel/assigned', {
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

export const deleteTravel = async (id) => {
  try {
    const response = await API.delete(`/travel/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
