import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../Constants/Constants';

// Define la interfaz para un Producto
export interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  category: string;
}

// Define el estado del store
interface ItemsStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useItemsStore = create<ItemsStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  // Obtener todos los productos
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar productos',
        isLoading: false 
      });
    }
  },

  // Agregar un nuevo producto
  addProduct: async (product: Product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, product);
      // Agregar el nuevo producto al estado actual
      set(state => ({ 
        products: [...state.products, response.data],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al agregar producto',
        isLoading: false 
      });
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  // Actualizar un producto existente
  updateProduct: async (product: Product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${product.id}`, product);
      // Actualizar el producto en el estado
      set(state => ({
        products: state.products.map(p => 
          p.id === product.id ? response.data : p
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar producto',
        isLoading: false 
      });
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  // Eliminar un producto
  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      // Eliminar el producto del estado
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar producto',
        isLoading: false 
      });
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },
}));