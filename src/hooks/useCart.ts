import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/Api";

export interface CartItem {
    id: string;
    cart: string;
    product: string;
    cantidad: number;
    price_at_addition: number;
}

export interface Cart {
    id: string;
    user: string;
    items: CartItem[];
}

export const useCart = () => {
    const queryClient = useQueryClient();

    // Fetch Cart
    const cartQuery = useQuery<Cart | null>({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await api.get("/carts/");
            const results = response.data.results || response.data;

            if (results && results.length > 0) {
                return results[0];
            }

            // If no cart found, try to create one if user is logged in
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const createResponse = await api.post("/carts/", { user: user.id });
                return createResponse.data;
            }

            return null;
        },
    });

    // Add Item to Cart
    const addItemMutation = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            let cartId = cartQuery.data?.id;

            if (!cartId) {
                const cart = await queryClient.fetchQuery<Cart | null>({ queryKey: ["cart"] });
                cartId = cart?.id;
            }

            const response = await api.post("/cartitems/", {
                cart: cartId,
                product: productId,
                cantidad: quantity,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Update Item Quantity
    const updateItemMutation = useMutation({
        mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
            const response = await api.patch(`/cartitems/${itemId}/`, {
                cantidad: quantity,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Remove Item from Cart
    const removeItemMutation = useMutation({
        mutationFn: async (itemId: string) => {
            await api.delete(`/cartitems/${itemId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Clear Cart
    const clearCartMutation = useMutation({
        mutationFn: async () => {
            const cart = cartQuery.data;
            if (!cart || !cart.items) return;

            // Parallel deletion
            await Promise.all(cart.items.map(item => api.delete(`/cartitems/${item.id}/`)));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const cartTotal = cartQuery.data?.items.reduce((total, item) => {
        return total + item.cantidad * item.price_at_addition;
    }, 0) || 0;

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        error: cartQuery.error,
        addItem: addItemMutation.mutateAsync,
        updateItem: updateItemMutation.mutateAsync,
        removeItem: removeItemMutation.mutateAsync,
        clearCart: clearCartMutation.mutateAsync,
        cartTotal,
        isActionsLoading: addItemMutation.isPending || updateItemMutation.isPending || removeItemMutation.isPending || clearCartMutation.isPending,
    };
};
