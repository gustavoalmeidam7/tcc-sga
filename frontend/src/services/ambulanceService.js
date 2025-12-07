import API from "./api";

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

export const createAmbulance = async (ambulanceData) => {
  try {
    const response = await API.post("/ambulance", {
      status: ambulanceData.status,
      placa: ambulanceData.placa,
      tipo: ambulanceData.tipo,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAmbulance = async (id, ambulanceData) => {
  try {
    const response = await API.patch(`/ambulance/${id}`, {
      status: ambulanceData.status,
      tipo: ambulanceData.tipo,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDriverAmbulance = async () => {
  try {
    const { getDriverInfo } = await import("./driverService");
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

export const addEquipment = async (ambulanceId, equipmentData) => {
  try {
    const payload = {
      equipamento: equipmentData.nome || equipmentData.equipamento,
      descricao:
        equipmentData.descricao && equipmentData.descricao.trim()
          ? equipmentData.descricao.trim()
          : "",
    };

    const response = await API.post(
      `/ambulance/add-equipment/${ambulanceId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEquipment = async (equipmentId, equipmentData) => {
  try {
    const response = await API.post(
      `/ambulance/update-equipment/${equipmentId}`,
      {
        equipamento: equipmentData.nome || equipmentData.equipamento,
        descricao: equipmentData.descricao || "",
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEquipment = async (equipmentId) => {
  try {
    const response = await API.delete(`/ambulance/equipment/${equipmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAmbulance = async (ambulanceId) => {
  try {
    const response = await API.delete(`/ambulance/${ambulanceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
