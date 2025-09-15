import API from './api.js';

const register = async (userData) => {
  const response = await API.post('/user/create', userData);
  return response.data;
};

const authService = {
  register,
};

export default authService;
