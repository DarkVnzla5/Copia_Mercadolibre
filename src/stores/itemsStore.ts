import {create} from "zustand";
import axios from "axios";


// Interfaz para el producto
export interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  category: string;
}

// Interfaz para el estado de la tienda (Store)
interface ItemsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

// Configuración de la URL base de Axios
const api=axios.create({
  baseURL:"http://localhost:8000/api"
  
}) ;

// Creación de la tienda de Zustand
export const useItemsStore = create<ItemsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // Obtener todos los productos de la API
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Product[]>("/products");
      set({ products: response.data, isLoading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: `Error al cargar los productos: ${err.message}`,
          isLoading: false,
        });
      } else {
        set({
          error: "Error desconocido al cargar los productos.",
          isLoading: false,
        });
      }
      console.error("Error en fetchProducts:", err);
    }
  },

  // Agregar un nuevo producto a la API y al estado local
  addProduct: async (newProduct) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Product>("/products", newProduct);
      set((state) => ({
        products: [...state.products, response.data],
        isLoading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: `Error al agregar el producto: ${err.message}`,
          isLoading: false,
        });
      } else {
        set({
          error: "Error desconocido al agregar el producto.",
          isLoading: false,
        });
      }
      console.error("Error en addProduct:", err);
    }
  },

  // Actualizar un producto existente en la API y en el estado local
  updateProduct: async (updatedProduct) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<Product>(
        `/products/${updatedProduct.id}`,
        updatedProduct
      );
      set((state) => ({
        products: state.products.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        ),
        isLoading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: `Error al actualizar el producto: ${err.message}`,
          isLoading: false,
        });
      } else {
        set({
          error: "Error desconocido al actualizar el producto.",
          isLoading: false,
        });
      }
      console.error("Error en updateProduct:", err);
    }
  },

  // Eliminar un producto de la API y del estado local
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error: `Error al eliminar el producto: ${err.message}`,
          isLoading: false,
        });
      } else {
        set({
          error: "Error desconocido al eliminar el producto.",
          isLoading: false,
        });
      }
      console.error("Error en deleteProduct:", err);
    }
  },
}));