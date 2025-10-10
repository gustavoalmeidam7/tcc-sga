export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; 
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return true;
  }
};

export const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (token && isTokenExpired(token)) {
    clearAuthToken();
    return null;
  }
  return token;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};
