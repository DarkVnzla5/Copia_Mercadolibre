import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/Api";
import { useCart } from "./useCart";

export interface Order {
    id: string;
    producto: string;
    cantidad: number;
    created_at?: string;
    status?: string;
}

export const useOrders = () => {
    const queryClient = useQueryClient();
    const { cart, clearCart } = useCart();

    // Fetch all orders
    const ordersQuery = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await api.get("/orders/");
            return response.data.results || response.data;
        },
    });

    // Fetch single order
    const useOrder = (id: string) => useQuery<Order>({
        queryKey: ["orders", id],
        queryFn: async () => {
            const response = await api.get(`/orders/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });

    // Create Order from Cart
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error("El carrito está vacío");
            }

            // Create orders for each item
            const orderPromises = cart.items.map((item) =>
                api.post("/orders/", {
                    producto: item.product,
                    cantidad: item.cantidad,
                })
            );

            const results = await Promise.all(orderPromises);

            // Clear cart on success
            await clearCart();

            return results.map(r => r.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    // Update Order
    const updateOrderMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
            const response = await api.patch(`/orders/${id}/`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", id] });
        },
    });

    // Delete Order
    const deleteOrderMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/orders/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        error: ordersQuery.error,
        createOrder: createOrderMutation.mutateAsync,
        updateOrder: updateOrderMutation.mutateAsync,
        deleteOrder: deleteOrderMutation.mutateAsync,
        useOrder,
        isCreating: createOrderMutation.isPending,
    };
};
