import api from "./axios";

// Public order creation (no login required).
export const createOrder = (payload) => api.post("/orders", payload);
