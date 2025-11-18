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
    const response = await API.get("/driver/travels");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const driverService = {
  getDriverInfo,
  getDriverTravels,
};

export default driverService;
