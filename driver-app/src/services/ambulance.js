import API from "./api";

export const getDriverAmbulance = async () => {
  try {
    const { getDriverInfo } = await import("./driver");
    const driverInfo = await getDriverInfo();

    if (!driverInfo || !driverInfo.id_ambulancia) {
      return null;
    }

    const response = await API.get(`/ambulance/${driverInfo.id_ambulancia}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAmbulanceById = async (ambulanceId) => {
  try {
    const response = await API.get(`/ambulance/${ambulanceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAmbulances = async (page = 0, pageSize = 30) => {
  try {
    const response = await API.get("/ambulance", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAmbulance = async (ambulanceId, ambulanceData) => {
  try {
    const response = await API.patch(`/ambulance/${ambulanceId}`, {
      status: ambulanceData.status,
      tipo: ambulanceData.tipo,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ambulanceService = {
  getDriverAmbulance,
  getAmbulanceById,
  getAmbulances,
  updateAmbulance,
};

export default ambulanceService;
