import API from './api';

export const createTravel = async (travelData) => {
  try {
    const response = await API.post('/travel', {
      inicio: travelData.inicio,
      fim: travelData.fim,
      local_inicio: travelData.local_inicio,
      local_fim: travelData.local_fim,
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
        viagensPorPagina,
        pagina,
      },
    });
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
