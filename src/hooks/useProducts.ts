import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/Api";

export interface ProductImage {
  id: number;
  image: string;
  product: number;
  is_main: boolean;
}

export interface Product {
  id?: string | number;
  code: string;
  name: string;
  title?: string; // Compatibility alias
  brand: string;
  images: (string | ProductImage)[];
  category: string;
  price: number | string;
  quantity: number;
  description?: string;
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}


export const useProducts = () => {
  const queryClient = useQueryClient();

  // Fetch all products
  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("products/");
      // The API returns { value: Product[], Count: number }
      return response.data.value || response.data;
    },
  });

  // Add Product - supports both JSON and FormData
  const addProductMutation = useMutation({
    mutationFn: async (data: Product | FormData) => {
      const isFormData = data instanceof FormData;
      const response = await api.post("products/", data, {
        headers: {
          ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' })
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Update Product - supports both JSON and FormData
  // Items.tsx sends { formData: FormData, id: string }
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string | number, formData: FormData | Record<string, any> }) => {
      const isFormData = formData instanceof FormData;
      const response = await api.patch(`products/${id}/`, formData, {
        headers: {
          ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' })
        }
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id.toString()] });
    },
  })


  // Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await api.delete(`products/${id}/`);
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
      const response = await api.get(`products/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};
