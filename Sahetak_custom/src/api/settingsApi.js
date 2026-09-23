import api from "./axios";

// Public. Returns { success, message, data: { profileImage, bannerImage } }.
export const getPublicSettings = () => api.get("/settings/public");