import { create } from 'zustand';
import api from "../services/Api";

// 1. Interfaces mejoradas
interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string; // URL del avatar
  access?: string;
  refresh?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: any) => Promise<boolean>;
}

// 2. Helper para manejar el almacenamiento local
const updateStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.access) localStorage.setItem('authtoken', user.access);
    if (user.refresh) localStorage.setItem('refreshtoken', user.refresh);
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('authtoken');
    localStorage.removeItem('refreshtoken');
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<User>('login/', { email, password });
      set({ user: data, isLoading: false });
      updateStorage(data);
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Credenciales inválidas',
        isLoading: false
      });
      return false;
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<User>('signup/', {
        email,
        password,
        first_name: name,
        username: email
      });
      set({ user: data, isLoading: false });
      updateStorage(data);
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Error en el registro',
        isLoading: false
      });
      return false;
    }
  },

  updateUser: async (data) => {
    set({ isLoading: true, error: null });
    const currentUser = get().user;
    if (!currentUser) return false;

    try {
      // Manejo dinámico de Payload (JSON o FormData para imágenes)
      let payload: any = data;
      let headers = {};

      if (data.avatar instanceof File) {
        const formData = new FormData();
        // Recorremos los datos para construir el FormData correctamente
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, value as any);
        });
        payload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      }

      // Usamos PATCH para actualizaciones parciales
      const { data: updatedUser } = await api.patch<User>(
        `users/${currentUser.id}/`,
        payload,
        { headers }
      );

      // Fusionamos el estado anterior con el nuevo para no perder tokens
      set((state) => {
        const newUser = { ...state.user, ...updatedUser } as User;
        updateStorage(newUser);
        return { user: newUser, isLoading: false };
      });

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Error al actualizar',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    set({ user: null, error: null });
    updateStorage(null);
  },
}));