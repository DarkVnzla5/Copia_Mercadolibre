import { create } from 'zustand';
import axios from 'axios';

// 1. Define la interfaz para el objeto de usuario
interface User {
  id: string;
  email: string;
  name?: string; // El nombre es opcional
  // Añade aquí cualquier otra propiedad del usuario que tu backend devuelva
}

//Define la interfaz para el estado de autenticación
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<boolean>; // 'Partial<User>' permite actualizar solo algunas propiedades
}

// Configuración de Axios para tu API
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Reemplaza con la URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = create<AuthState>((set, get) => ({ // Añadimos 'get' para acceder al estado actual
  user: null, // Objeto de usuario si está logeado, null si no
  isLoading: false, // Para manejar el estado de carga
  error: null, // Para manejar errores

  // Función para iniciar sesión
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Realiza la llamada POST a tu endpoint de login
      const response = await api.post<User>('/login', { email, password }); // Especifica el tipo de respuesta esperada
      const userData = response.data; // Asume que el backend devuelve los datos del usuario

      if (userData) {
        set({ user: userData, isLoading: false });
        // Aquí podrías guardar un token de autenticación si tu API lo devuelve
        // Por ejemplo: localStorage.setItem('authToken', userData.token);
        return true; // Éxito
      } else {
        // En caso de que la API devuelva una respuesta exitosa pero sin datos de usuario (poco probable)
        set({ error: 'Credenciales inválidas', isLoading: false });
        return false; // Fallo
      }
    } catch (err: any) { // 'any' puede ser más específico si conoces la estructura del error de Axios
      // Manejo de errores de Axios
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      set({ error: errorMessage, isLoading: false });
      return false; // Fallo
    }
  },

  // Función para registrarse
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      // Realiza la llamada POST a tu endpoint de registro
      const response = await api.post<User>('/signup', { email, password, name }); // Especifica el tipo de respuesta esperada
      const newUser = response.data; // Asume que el backend devuelve los datos del nuevo usuario

      if (newUser) {
        set({ user: newUser, isLoading: false });
        // Aquí podrías guardar un token de autenticación si tu API lo devuelve
        // Por ejemplo: localStorage.setItem('authToken', newUser.token);
        return true; // Éxito
      } else {
        set({ error: 'Error al registrarse', isLoading: false });
        return false; // Fallo
      }
    } catch (err: any) {
      // Manejo de errores de Axios
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      set({ error: errorMessage, isLoading: false });
      return false; // Fallo
    }
  },

  // Función para cerrar sesión
  logout: () => {
    set({ user: null, error: null });
    // Aquí también deberías eliminar cualquier token de autenticación
    // Por ejemplo: localStorage.removeItem('authToken');
  },

  // Función para modificar el perfil del usuario
  updateUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Asegúrate de que haya un usuario logeado para actualizar
      const currentUser = get().user; // Usamos 'get()' para acceder al estado actual
      if (!currentUser) {
        set({ error: 'No hay usuario autenticado para actualizar', isLoading: false });
        return false;
      }

      // Si tu API requiere un token de autenticación en los headers
      // const authToken = localStorage.getItem('authToken');
      // api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      // Realiza la llamada PUT/PATCH a tu endpoint de actualización de perfil
      const response = await api.put<User>(`/users/${currentUser.id}`, data); // O patch, dependiendo de tu API
      const updatedUser = response.data; // Asume que el backend devuelve los datos actualizados del usuario

      if (updatedUser) {
        set((state) => ({
          user: { ...state.user, ...updatedUser }, // Fusionar datos actualizados con el usuario existente
          isLoading: false,
        }));
        return true; // Éxito
      } else {
        set({ error: 'Error al actualizar el perfil', isLoading: false });
        return false; // Fallo
      }
    } catch (err: any) {
      // Manejo de errores de Axios
      const errorMessage = err.response?.data?.message || 'Error al actualizar el perfil';
      set({ error: errorMessage, isLoading: false });
      return false; // Fallo
    }
  },
}));
