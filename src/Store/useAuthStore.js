// src/store/useAuthStore.js
import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,

  // Login de usuario
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/users/login/", credentials);
      const { user, token } = response.data;

      // Guardar en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true, loading: false });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.non_field_errors?.[0] ||
        "Error en el login";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Registro de nuevo usuario
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/users/", userData);
      const user = response.data;

      // Auto-login después del registro
      const loginResponse = await api.post("/users/login/", {
        email: userData.email,
        password: userData.password,
      });

      const { token } = loginResponse.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true, loading: false });

      return user;
    } catch (error) {
      const errorMessage = error.response?.data || "Error en el registro";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Actualizar perfil de usuario
  updateProfile: async (userData) => {
    try {
      const { user } = get();
      const response = await api.patch(`/users/${user.id}/`, userData);
      const updatedUser = response.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });

      return updatedUser;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },
}));
