import api from "./axios";

export const getPromotions = () =>
  api.get("/promotions").then((response) => response.data);

export const getPromotion = (id) =>
  api.get(`/promotions/${id}`).then((response) => response.data);

export const createPromotion = (payload) =>
  api.post("/promotions", payload).then((response) => response.data);

export const updatePromotion = (id, payload) =>
  api.patch(`/promotions/${id}`, payload).then((response) => response.data);

export const deletePromotion = (id) =>
  api.delete(`/promotions/${id}`).then((response) => response.data);
