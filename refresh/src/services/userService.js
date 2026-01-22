import api from "./apiservice";

export const getUserById = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response.data.user || response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/user/${userId}`, userData);
  return response.data.user || response.data;
};
