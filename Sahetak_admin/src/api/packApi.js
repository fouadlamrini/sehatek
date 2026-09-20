import api from "./axios";

export const getPacks = () =>
  api.get("/packs").then((response) => response.data);

export const getPack = (id) =>
  api.get(`/packs/${id}`).then((response) => response.data);

export const createPack = (payload) =>
  api.post("/packs", payload).then((response) => response.data);

export const updatePack = (id, payload) =>
  api.patch(`/packs/${id}`, payload).then((response) => response.data);

export const deletePack = (id) =>
  api.delete(`/packs/${id}`).then((response) => response.data);
