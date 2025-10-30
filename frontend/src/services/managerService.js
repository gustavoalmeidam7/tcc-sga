import api from "./api";

export async function createUpgradeToken() {
  const response = await api.post("/manager/");
  return response.data;
}

export async function getUpgradeTokenInfo(token) {
  const response = await api.get(`/upgradetoken/${token}`);
  return response.data;
}

export async function upgradeAccount(token, driverFields = null) {
  const response = await api.post(`/upgradetoken/${token}`, driverFields);
  return response.data;
}
