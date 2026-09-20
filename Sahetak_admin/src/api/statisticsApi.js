import api from "./axios";

export const getStatistics = () =>
  api.get("/statistics").then((response) => response.data);
