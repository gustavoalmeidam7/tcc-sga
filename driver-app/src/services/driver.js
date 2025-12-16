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

export const updateDriver = async (driverFields) => {
  try {
    const response = await API.patch("/driver/update/", driverFields);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const driverService = {
  getDriverInfo,
  getDriverTravels,
  updateDriver,
};

export default driverService;
