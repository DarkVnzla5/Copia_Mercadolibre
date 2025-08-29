// src/store/useOrderStore.js
import { create } from "zustand";
import api from "../services/api";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Obtener todas las órdenes
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/orders/");
      set({ orders: response.data.results || response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data, loading: false });
    }
  },

  // Obtener orden por ID
  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/orders/${id}/`);
      set({ currentOrder: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data, loading: false });
      throw error;
    }
  },

  // Crear nueva orden desde el carrito
  createOrderFromCart: async () => {
    try {
      const { cart } = useCartStore.getState();
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error("El carrito está vacío");
      }

      // Crear órdenes para cada item del carrito
      const orderPromises = cart.items.map((item) =>
        api.post("/orders/", {
          producto: item.product,
          cantidad: item.cantidad,
        })
      );

      const orders = await Promise.all(orderPromises);

      // Vaciar carrito después de crear órdenes
      await useCartStore.getState().clearCart();

      set((state) => ({
        orders: [...state.orders, ...orders.map((r) => r.data)],
      }));

      return orders.map((r) => r.data);
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Actualizar orden
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.patch(`/orders/${id}/`, orderData);
      const updatedOrder = response.data;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? updatedOrder : order
        ),
        currentOrder: updatedOrder,
      }));

      return updatedOrder;
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },

  // Eliminar orden
  deleteOrder: async (id) => {
    try {
      await api.delete(`/orders/${id}/`);

      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        currentOrder: null,
      }));
    } catch (error) {
      set({ error: error.response?.data });
      throw error;
    }
  },
}));
export default useOrderStore;
