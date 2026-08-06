import api from "../lib/axios";

export const getCountries = async () => {
  const { data } = await api.get("/countries");
  return data.data;
};

export const getStates = async () => {
  const { data } = await api.get("/states");
  return data.data;
};

export const getCities = async () => {
  const { data } = await api.get("/cities");
  return data.data;
};
