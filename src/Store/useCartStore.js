// src/store/useCartStore.js
import { create } from "zustand";
import api from "../services/api";

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  // Obtener carrito del usuario
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/carts/");
      if (response.data.results && response.data.results.length > 0) {
        set({ cart: response.data.results[0], loading: false });
      } else {
        // Crear nuevo carrito si no existe
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const newCartResponse = await api.post("/carts/", { user: user.id });
          set({ cart: newCartResponse.data, loading: false });
        }
      }
    } catch (error) {
      set({ error: error.response?.data, loading: false });
    }
  },

  // Agregar producto al carrito
  addToCart: async (productId, quantity = 1) => {
    try {
      const { cart } = get();
      if (!cart) {
        await get().fetchCart();
        return get().addToCart(productId, quantity);
      }

      const response = await api.post("/cartitems/", {
        cart: cart.id,
        product: productId,
        cantidad: quantity,
      });

      // Actualizar carrito en el estado
      set((state) => ({
        cart: {
          ...state.cart,
          items: [...state.cart.items, response.data],
        },
      }));

      return response.data;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Actualizar cantidad en el carrito
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cartitems/${itemId}/`, {
        cantidad: quantity,
      });

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === itemId ? response.data : item
          ),
        },
      }));

      return response.data;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Eliminar item del carrito
  removeFromCart: async (itemId) => {
    try {
      await api.delete(`/cartitems/${itemId}/`);

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== itemId),
        },
      }));
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Vaciar carrito
  clearCart: async () => {
    try {
      const { cart } = get();
      if (!cart) return;

      // Eliminar todos los items del carrito
      for (const item of cart.items) {
        await api.delete(`/cartitems/${item.id}/`);
      }

      set({ cart: { ...cart, items: [] } });
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Calcular total del carrito
  getCartTotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;

    return cart.items.reduce((total, item) => {
      return total + item.cantidad * item.price_at_addition;
    }, 0);
  },
}));
