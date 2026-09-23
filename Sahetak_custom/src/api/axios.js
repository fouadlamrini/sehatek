import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Guard against shipping a build that silently targets localhost.
if (!API_URL && import.meta.env.PROD) {
  throw new Error("VITE_API_URL must be defined when building for production.");
}

const api = axios.create({
  baseURL: API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Return the response body directly ({ success, message, data }).
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
