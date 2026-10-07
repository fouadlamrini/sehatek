import api from "./axios";

// Public. Returns { success, message, data: City[] }.
// activeOnly is the customer-site view: only the cities delivery is currently
// available in.
export const getCities = () => api.get("/cities?activeOnly=true");
