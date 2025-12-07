import API from "./api.js";

const login = async (email, senha) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", senha);

  const response = await API.post("/token", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

const register = async (userData) => {
  const response = await API.post("/user/", userData);
  return response.data;
};

const getMe = async () => {
  const response = await API.get("/user/");
  return response.data;
};

const getAllUsers = async () => {
  const response = await API.get("/user/getusers");
  return response.data;
};

const getUserById = async (userId) => {
  const response = await API.get(`/user/${userId}`);
  return response.data;
};

const updateUser = async (userData) => {
  const response = await API.patch("/user/", userData);
  return response.data;
};

const deleteUser = async () => {
  const response = await API.delete("/user/");
  return response.data;
};

const logout = async () => {
  const response = await API.post("/token/logout");
  return response.data;
};

const refreshToken = async () => {
  const response = await API.post("/token/refresh-token");
  return response.data;
};

const sendRestorePassword = async (userEmail) => {
  const response = await API.post("/token/send-restore-password", {
    userEmail,
  });
  return response.data;
};

const restorePassword = async (restoreCode, newPassword) => {
  const response = await API.post("/token/restore-password", {
    restoreCode,
    newPassword,
  });
  return response.data;
};

const authService = {
  login,
  register,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logout,
  refreshToken,
  sendRestorePassword,
  restorePassword,
};

export default authService;
