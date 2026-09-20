import api from "./axios";

export const getOrders = () =>
  api.get("/orders").then((response) => response.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((response) => response.data);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((response) => response.data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`).then((response) => response.data);
