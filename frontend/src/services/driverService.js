import API from "./api";

export const getDriverInfo = async () => {
  try {
    const response = await API.get("/driver/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDriverTravels = async () => {
  try {
    const response = await API.get("/travel/assigned/", {
      params: {
        page: 0,
        pageSize: 100,
        canceled: false,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignSelfToTravel = async (travelId) => {
  try {
    const response = await API.post(`/driver/travel/${travelId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const driverService = {
  getDriverInfo,
  getDriverTravels,
  assignSelfToTravel,
};

export default driverService;
