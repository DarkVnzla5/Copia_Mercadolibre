import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/Api";

export interface CartItem {
	id: string;
	cart: string;
	product: string | number;
	quantity: number;
	price_at_addition: string | number;
}

export interface Cart {
	id: string;
	user: string;
	items: CartItem[];
}

export const useCart = () => {
	const queryClient = useQueryClient();
	const token = localStorage.getItem("authtoken");

	// Fetch Cart
	const cartQuery = useQuery<Cart | null>({
		queryKey: ["cart"],
		queryFn: async () => {
			if (!token) return null;
			const response = await api.get("carts/");
			const results = response.data.results || response.data;
			return Array.isArray(results) && results.length > 0 ? results[0] : null;
		}, enabled: !!localStorage.getItem("authtoken"),
		staleTime: 1000 * 60, retry: 1,
	});
	const addItemMutation = useMutation({
		mutationFn: async ({ productId, quantity }: { productId: string | number; quantity: number }) => {
			if (!token) throw new Error("Usuario no autenticado");

			// 1. BUSCAR CARRITO (Con manejo de errores robusto)
			let currentCart = queryClient.getQueryData<Cart | null>(["cart"]);

			if (!currentCart) {
				try {
					const res = await api.get("carts/");
					// Validación defensiva: Si res o data son nulos, devuelve array vacío
					const data = res?.data?.results || res?.data || [];

					// Si devuelve un objeto directo (un solo carrito), lo usamos. Si es array, tomamos el primero.
					if (Array.isArray(data)) {
						currentCart = data.length > 0 ? data[0] : null;
					} else if (data && data.id) {
						currentCart = data;
					}
				} catch (e) {
					// Si falla el GET (ej: 404), simplemente ignoramos y currentCart sigue siendo null
					currentCart = null;
				}
			}

			// 2. CREAR CARRITO (Si después del intento anterior sigue siendo null)
			if (!currentCart) {
				const userStr = localStorage.getItem("user");
				if (!userStr) throw new Error("Error de sesión: No hay datos de usuario");
				const user = JSON.parse(userStr);

				const createRes = await api.post("carts/", { user: user.id });
				currentCart = createRes.data;
			}

			if (!currentCart || !currentCart.id) {
				throw new Error("Error crítico: No se pudo instanciar un carrito.");
			}

			// 3. AGREGAR O ACTUALIZAR ITEM
			// Forzamos String para comparación segura
			const existingItem = currentCart.items?.find(
				(item) => String(item.product) === String(productId)
			);

			if (existingItem) {
				// PATCH: Sumar cantidad
				const newQuantity = Number(existingItem.quantity) + Number(quantity);
				const response = await api.patch(`cartitems/${existingItem.id}/`, {
					quantity: newQuantity
				});
				return response.data;
			} else {
				// POST: Nuevo item
				const response = await api.post("cartitems/", {
					cart: currentCart.id,
					product: productId,
					quantity: quantity,
				});
				return response.data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
	// Remove Item from Cart
	const removeItemMutation = useMutation({
		mutationFn: async (itemId: string) => {
			await api.delete(`cartitems/${itemId}/`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	//Update Item Quantity
	const updateItemMutation = useMutation({
		mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
			if (quantity <= 0) {
				await api.delete(`cartitems/${itemId}/`);
				return;
			}
			const response = await api.patch(`cartitems/${itemId}/`, { quantity });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	// Clear Cart
	const clearCartMutation = useMutation({
		mutationFn: async () => {
			const currentCart = queryClient.getQueryData<Cart>(["cart"]);
			if (!currentCart?.items?.length) return;
			const deletePromises = currentCart.items.map((item) => api.delete(`cartitems/${item.id}/`)
			);
			await Promise.all(deletePromises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
	//Calculo de totales
	const cartTotal = (cartQuery.data?.items || []).reduce((total, item) => {
		const price = Number(item.price_at_addition);
		const qty = item.quantity;
		if (isNaN(price) || isNaN(qty)) return total;
		return total + (qty * price);
	}, 0);

	return {
		cart: cartQuery.data,
		isLoading: cartQuery.isLoading,
		isError: cartQuery.isError,
		addItem: addItemMutation.mutateAsync,
		removeItem: removeItemMutation.mutateAsync,
		updateItem: updateItemMutation.mutateAsync,
		clearCart: clearCartMutation.mutateAsync,
		cartTotal,
		// Loading state unificado para deshabilitar botones
		isActionsLoading:
			addItemMutation.isPending ||
			removeItemMutation.isPending ||
			updateItemMutation.isPending ||
			clearCartMutation.isPending
	};
};
