import api from "./axios";

export const getAdmins = () =>
  api.get("/admins").then((response) => response.data);

export const createAdmin = (payload) =>
  api.post("/admins", payload).then((response) => response.data);

export const deleteAdmin = (id) =>
  api.delete(`/admins/${id}`).then((response) => response.data);
