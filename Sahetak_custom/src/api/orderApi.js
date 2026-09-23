import api from "./axios";

// Public order creation (no login required).
export const createOrder = (payload) => api.post("/orders", payload);

// Guest tracking (no login required).
export const trackOrder = (trackingCode, phone) =>
  api.post("/orders/track", { trackingCode, phone });

export const cancelOrder = (trackingCode, phone) =>
  api.patch("/orders/track/cancel", { trackingCode, phone });

export const updateOrder = (payload) =>
  api.patch("/orders/track/update", payload);
