import api from "./axios";

export const login = (credentials) =>
  api.post("/auth/login", credentials).then((response) => response.data);

export const getProfile = () =>
  api.get("/auth/me").then((response) => response.data);

export const logout = (refreshToken) =>
  api.post("/auth/logout", { refreshToken }).then((response) => response.data);

export const changePassword = (payload) =>
  api
    .patch("/auth/change-password", payload)
    .then((response) => response.data);

export const changeName = (name) =>
  api.patch("/auth/change-name", { name }).then((response) => response.data);
