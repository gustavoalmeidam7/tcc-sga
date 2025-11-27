import API from "./api";

export async function createUpgradeToken() {
  const response = await API.post("/manager/");
  return response.data;
}

export async function getUpgradeTokenInfo(token) {
  const response = await API.get(`/upgradetoken/${token}`);
  return response.data;
}

export async function upgradeAccount(token, driverFields = null) {
  const response = await API.post(`/upgradetoken/${token}`, driverFields);
  return response.data;
}

export async function assignAmbulanceToDriver(driverId, ambulanceId) {
  const response = await API.post(
    `/manager/assignambulance/${driverId}/${ambulanceId}`
  );
  return response.data;
}
