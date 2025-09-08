import React, { useState, useEffect } from "react";
import { useItemsStore } from "../stores/itemsStore"; // Importa el store de Zustand

// Define la interfaz para un Producto
interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  category: string;
}

// Componente principal Items.tsx
function Items() {
  // Ahora usamos el store de Zustand
  const {
    products,
    fetchProducts,
    deleteProduct,
    updateProduct,
    addProduct,
    isLoading,
    error,
  } = useItemsStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Llamada a la API al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const startEditing = (product: Product) => {
    setEditingProduct(product);
  };

  return (
    <div className="min-h-screen bg-base-300 flex flex-col items-center py-10 font-sans">
      <p className="badge badge-primary-content p-5 rounded-md mb-4 text-lg font-bold">
        🔧 Gestor de Productos 🛠️
      </p>

      {/* Muestra mensajes de carga o error del store */}
      {isLoading && <p>Cargando productos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ProductForm
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />
      <ProductList
        products={products}
        onDeleteProduct={deleteProduct}
        onEditProduct={startEditing}
      />
    </div>
  );
}

// ... (Los componentes ProductForm y ProductList se mantienen igual) ...

interface ProductFormProps {
  onAddProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onAddProduct,
  onUpdateProduct,
  editingProduct,
  setEditingProduct,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    brand: "",
    images: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        name: editingProduct.name,
        brand: editingProduct.brand,
        images: editingProduct.images.join(", "),
        category: editingProduct.category,
      });
      setMessage("");
      setMessageType("");
    } else {
      setFormData({
        id: "",
        name: "",
        brand: "",
        images: "",
        category: "",
      });
    }
  }, [editingProduct]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.name ||
      !formData.brand ||
      !formData.images ||
      !formData.category
    ) {
      setMessage("Por favor, completa todos los campos.");
      setMessageType("error");
      return;
    }

    const productToSave: Product = {
      id: formData.id,
      name: formData.name,
      brand: formData.brand,
      images: formData.images
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img !== ""),
      category: formData.category,
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(productToSave);
        setMessage("¡Producto actualizado exitosamente!");
      } else {
        await onAddProduct(productToSave);
        setMessage("¡Producto agregado exitosamente!");
      }
      setMessageType("success");
    } catch (err) {
      setMessage("Hubo un error al procesar la solicitud.");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="card bg-base-100 shadow-xl p-8 w-full max-w-2xl border border-gray-200 gap-2">
      <p className="text-2xl font-bold mb-6 text-center">
        {editingProduct ? "Editar Item" : "Agregar Nuevo Item"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="card-title">
          <label htmlFor="id" className="label">
            Codigo:
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border sm:text-sm"
            placeholder="Ej: H-001"
            required
            disabled={!!editingProduct}
          />
          {editingProduct && (
            <p className="text-xs mt-1">El Codigo no se puede modificar.</p>
          )}
        </div>
        <div>
          <label htmlFor="name" className="label">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border sm:text-sm"
            placeholder="Ej: Martillo"
            required
          />
        </div>
        <div>
          <label htmlFor="brand" className="label">
            Marca:
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm"
            placeholder="Ej: Truper"
            required
          />
        </div>
        <div>
          <label htmlFor="images" className="label">
            Imágenes (URLs separadas por comas):
          </label>
          {/* CORRECCIÓN: CAMBIAR type="file" a type="text" */}
          <input
            type="text"
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm"
            placeholder="Ej: url1.jpg, url2.png"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="label">
            Categoría:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm"
            placeholder="Ej: Herramientas Manuales"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
        </button>

        {editingProduct && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="btn-primary"
          >
            Cancelar Edición
          </button>
        )}

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-center text-sm ${
              messageType === "success" ? "btn-success" : "btn-error"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

// ... (El componente ProductList se mantiene igual) ...

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onDeleteProduct,
  onEditProduct,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Items Agregados
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-4">
          No hay productos agregados aún. ¡Usa el formulario de arriba para
          añadir algunos!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-extrabold text-gray-800 mb-2">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Codigo:</span> {product.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Marca:</span> {product.brand}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Categoría:</span>
                  {product.category}
                </p>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Imágenes:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.images.length > 0 ? (
                      product.images.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Imagen de ${product.name} ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-md border border-gray-300 transition-transform transform hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/80x80/cccccc/333333?text=No+Img`;
                            e.currentTarget.alt = "Imagen no disponible";
                          }}
                        />
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No hay imágenes.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out transform hover:scale-105 text-sm font-medium shadow-md"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-105 text-sm font-medium shadow-md"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Items;
