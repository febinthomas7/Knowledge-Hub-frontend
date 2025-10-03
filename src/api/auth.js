import api from "./api";

export const loginUser = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
};

export const registerHospital = async (userData) => {
  const res = await api.post("/api/hospital/register", userData);
  return res.data;
};

export const loginHospital = async (userData) => {
  const res = await api.post("/api/hospital/login", userData);
  return res.data;
};
