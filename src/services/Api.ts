import axios, { type AxiosInstance } from "axios";
export const BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api/`;


const api: AxiosInstance = axios.create({
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
    if ((error.response?.status === 401 || error.response?.status === 403) && !window.location.pathname.includes("/LogIn")) {
      // Token expirado o inválido - logout
      localStorage.removeItem("authtoken");
      localStorage.removeItem("user");
      window.location.href = "/LogIn";
      console.log(error.response?.status);
    }

    if (error.response?.status === 505) {
      console.error("Error del servidor:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
