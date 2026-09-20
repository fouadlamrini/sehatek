import api from "./axios";

export const getProducts = () =>
  api.get("/products").then((response) => response.data);

export const getProduct = (id) =>
  api.get(`/products/${id}`).then((response) => response.data);

export const createProduct = (formData) =>
  api.post("/products", formData).then((response) => response.data);

export const updateProduct = (id, formData) =>
  api.patch(`/products/${id}`, formData).then((response) => response.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((response) => response.data);
