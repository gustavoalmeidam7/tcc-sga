import API from './api.js';

const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await API.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

const register = async (userData) => {
  const response = await API.post('/user/', userData);
  return response.data;
};

const logout = () => {
  return API.post('/token/revoke');
};

const getMe = async () => {
  const response = await API.get('/user/');
  return response.data;
};

const authService = {
  login,
  register,
  logout,
  getMe,
};

export default authService;
