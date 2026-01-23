import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/Api";

export interface ProductImage {
    id: number;
    image: string;
    product: number;
    is_main: boolean;
}

export interface Product {
    id: string | number;
    name: string;
    title?: string; // Compatibility alias
    brand: string;
    images: (string | ProductImage)[];
    category: string;
    price: number | string;
    description?: string;
    thumbnail?: string;
}

export const useProducts = () => {
    const queryClient = useQueryClient();

    // Fetch all products
    const productsQuery = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await api.get("/products/");
            // The API returns { value: Product[], Count: number }
            return response.data.value || response.data;
        },
    });

    // Add Product
    const addProductMutation = useMutation({
        mutationFn: async (newProduct: Product) => {
            const response = await api.post("/products/", newProduct);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // Update Product
    const updateProductMutation = useMutation({
        mutationFn: async (updatedProduct: Product) => {
            const response = await api.put(`/products/${updatedProduct.id}/`, updatedProduct);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // Delete Product
    const deleteProductMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        products: productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        error: productsQuery.error,
        addProduct: addProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        deleteProduct: deleteProductMutation.mutateAsync,
        isAdding: addProductMutation.isPending,
        isUpdating: updateProductMutation.isPending,
        isDeleting: deleteProductMutation.isPending,
    };
};

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ["products", id],
        queryFn: async () => {
            const response = await api.get(`/products/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
};
