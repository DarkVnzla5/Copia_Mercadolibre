import axios from "axios";

const API_BASE_URL =
  process.env.React_APP_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    // You can add any request interceptors here
    // For example, adding an authorization token
    const token = localStorage.getItem("authtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - logout
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 500) {
      console.error("Error del servidor:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
