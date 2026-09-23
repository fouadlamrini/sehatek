import api from "./axios";

export const getSettings = () =>
  api.get("/settings").then((response) => response.data);

// formData contains profileImage and/or bannerImage (File objects).
export const updateSettings = (formData) =>
  api.patch("/settings", formData).then((response) => response.data);