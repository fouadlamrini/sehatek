import api from "./axios";

// Public. Backend computes the authoritative price for a set of unique products.
export const calculatePrice = (productIds) =>
  api.post("/pricing/calculate", { productIds });
