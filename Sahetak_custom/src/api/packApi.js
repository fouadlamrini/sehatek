import api from "./axios";

export const getPacks = () => api.get("/packs");
