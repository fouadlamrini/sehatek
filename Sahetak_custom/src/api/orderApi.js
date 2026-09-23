import api from "./axios";

// Public order creation (no login required).
export const createOrder = (payload) => api.post("/orders", payload);

// Guest tracking (no login required). The response carries a short-lived
// "trackToken" that must be sent with update/cancel below.
export const trackOrder = (trackingCode, phone) =>
  api.post("/orders/track", { trackingCode, phone });

export const cancelOrder = ({ trackingCode, phone, trackToken }) =>
  api.patch("/orders/track/cancel", { trackingCode, phone, trackToken });

export const updateOrder = (payload) =>
  api.patch("/orders/track/update", payload);
