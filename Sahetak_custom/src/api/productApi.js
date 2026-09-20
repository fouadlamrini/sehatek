import api from "./axios";

export const getProducts = () => api.get("/products");

export const getProduct = (id) => api.get(`/products/${id}`);
