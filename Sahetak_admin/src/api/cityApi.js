import api from "./axios";

export const getCities = () =>
  api.get("/cities").then((response) => response.data);

export const getCity = (id) =>
  api.get(`/cities/${id}`).then((response) => response.data);

export const createCity = (payload) =>
  api.post("/cities", payload).then((response) => response.data);

export const updateCity = (id, payload) =>
  api.patch(`/cities/${id}`, payload).then((response) => response.data);

export const deleteCity = (id) =>
  api.delete(`/cities/${id}`).then((response) => response.data);
