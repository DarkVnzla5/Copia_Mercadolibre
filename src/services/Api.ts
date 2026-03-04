import axios, { type AxiosInstance } from "axios";

export const BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api/`;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// --- Interceptor de Petición ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor de Respuesta ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshtoken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem("authtoken", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Sesión expirada definitivamente");
          localStorage.clear();
          window.location.href = "/Auths";
        }
      } else {
        localStorage.clear();
        window.location.href = "/Auths";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * COMPROBACIÓN DE CREDENCIALES SOCIALES
 * Esta función envía el token de Google al backend para validarlo.
 */
export const socialAuthVerification = async (provider: string, token: string) => {
  // El backend debe recibir el token, validarlo con Google y 
  // devolver el usuario con sus roles (admin/staff/cliente)
  return api.post(`auth/${provider}/`, {
    token: token
  });
};

export default api;