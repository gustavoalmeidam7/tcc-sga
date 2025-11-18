import API from "./api.js";

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
  return response.data;
};

const endTravel = async (id) => {
  const response = await API.post(`/travel/end/${id}`);
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
