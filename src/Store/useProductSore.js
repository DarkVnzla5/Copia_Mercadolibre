// src/store/useProductStore.js
import { create } from "zustand";
import api from "../services/api";

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
  },

  // Obtener todos los productos
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.minPrice) params.append("price_min", filters.minPrice);
      if (filters.maxPrice) params.append("price_max", filters.maxPrice);

      const response = await api.get(`/products/?${params}`);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data, loading: false });
    }
  },

  // Obtener un producto por ID
  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/products/${id}/`);
      set({ currentProduct: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data, loading: false });
      throw error;
    }
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products/", productData);
      const newProduct = response.data;

      set((state) => ({
        products: [...state.products, newProduct],
      }));

      return newProduct;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    try {
      const response = await api.patch(`/products/${id}/`, productData);
      const updatedProduct = response.data;

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
        currentProduct: updatedProduct,
      }));

      return updatedProduct;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}/`);

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        currentProduct: null,
      }));
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Aplicar filtros
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  // Limpiar filtros
  clearFilters: () => {
    set({ filters: { category: "", search: "", minPrice: "", maxPrice: "" } });
  },

  // Buscar productos
  searchProducts: async (searchTerm) => {
    set({ loading: true });
    try {
      const response = await api.get(`/products/?search=${searchTerm}`);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data, loading: false });
    }
  },
}));
export default useProductStore;
