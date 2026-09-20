import api from "./axios";

export const getPromotions = () => api.get("/promotions");
