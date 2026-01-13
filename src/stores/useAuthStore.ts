import { create } from 'zustand';
import api from "../services/Api";

// 1. Define la interfaz para el objeto de usuario
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define la interfaz para el estado de autenticación
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isLoading: false,
  error: null,

  // Función para iniciar sesión
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<User>('/login', { email, password });
      const userData = response.data;

      if (userData) {
        set({ user: userData, isLoading: false });
        // El interceptor en Api.ts espera 'authtoken'
        // localStorage.setItem('authtoken', userData.token); // Asumiendo que el backend devuelve un token
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        set({ error: 'Credenciales inválidas', isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any).response?.data?.message || 'Error al iniciar sesión';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Función para registrarse
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<User>('/signup', { email, password, name });
      const newUser = response.data;

      if (newUser) {
        set({ user: newUser, isLoading: false });
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      } else {
        set({ error: 'Error al registrarse', isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any).response?.data?.message || 'Error al registrarse';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Función para cerrar sesión
  logout: () => {
    set({ user: null, error: null });
    localStorage.removeItem('authtoken');
    localStorage.removeItem('user');
  },

  // Función para modificar el perfil del usuario
  updateUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().user;
      if (!currentUser) {
        set({ error: 'No hay usuario autenticado para actualizar', isLoading: false });
        return false;
      }

      const response = await api.put<User>(`/users/${currentUser.id}`, data);
      const updatedUser = response.data;

      if (updatedUser) {
        set((state) => {
          const newUser = { ...state.user, ...updatedUser } as User;
          localStorage.setItem('user', JSON.stringify(newUser));
          return {
            user: newUser,
            isLoading: false,
          };
        });
        return true;
      } else {
        set({ error: 'Error al actualizar el perfil', isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any).response?.data?.message || 'Error al actualizar el perfil';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },
}));
