import React, { useState, useEffect, useRef } from "react";
import type { Product } from "../hooks/useProducts";
import { useProducts } from "../hooks/useProducts";


// Componente principal Items.tsx
function Items() {
  const {
    products,
    isLoading,
    isError,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await addProduct(product);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      await updateProduct(product);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex flex-col items-center py-10 font-sans">

      {/* Muestra mensajes de carga o error del hook */}
      {isError && <p className="text-red-500">{(error as Error)?.message || "Error al cargar productos"}</p>}

      <div ref={formRef} className="lg:col-span-5 xl:col-span-4">
        <ProductForm
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      <div className="lg:col-span-7 xl:col-span-8">
        {isLoading ? (
          <div>
            <div className="w-10 h-10 border-4 border-primary border-t-secondary rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.2em] text-[10px]">Cargando productos...</p>
          </div>
        ) : (
          <ProductList
            products={products}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={startEditing}
          />
        )}
      </div>
    </div>
  );
};

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
    code: "",
    name: "",
    brand: "",
    images: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [notification, setNotification] = useState({ Text: "", Type: "" });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: String(editingProduct.id),
        code: editingProduct.code,
        name: editingProduct.name,
        brand: editingProduct.brand || "",
        images: editingProduct.images.map((img) => typeof img === "string" ? img : img.image).join(", "),
        category: editingProduct.category || "",
        price: String(editingProduct.price),
        quantity: String(editingProduct.quantity),
      });
    } else {
      setFormData({
        id: "",
        code: "",
        name: "",
        brand: "",
        images: "",
        category: "",
        price: "",
        quantity: "",
      })
    }
  }, [editingProduct])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
      // Actualizar el campo images con los nombres de archivo para mostrar
      const fileNames = filesArray.map(f => f.name).join(", ");
      setFormData(prev => ({ ...prev, images: fileNames }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('code', formData.code);
      data.append('name', formData.name);
      data.append('brand', formData.brand);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      imageFiles.forEach((file) => {
        data.append('images', file);
      });
      if (editingProduct) {
        await onUpdateProduct({
          formData: data,
          id: String(editingProduct.id)
        } as any);
        setNotification({ Text: "Producto actualizado correctamente", Type: "success" })
      } else {
        await onAddProduct(data as any);
        setNotification({ Text: "Producto agregado correctamente", Type: "success" })
        setFormData({
          id: "",
          code: "",
          name: "",
          brand: "",
          images: "",
          category: "",
          price: "",
          quantity: "",
        });
        setImageFiles([]);
      }
      setTimeout(() => {
        setNotification({ Text: "", Type: "" });
      }, 3000);
    } catch (error: any) {
      console.error("Error al agregar/actualizar producto:", error);
      setNotification({ Text: error.response.data.message, Type: "error" });
    }
  };
  // Limpiar formulario después de agregar (no después de editar)
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };
  return (
    <div className="card bg-base-100 shadow-xl p-8 w-full max-w-2xl border border-primary gap-2 flex">
      <p className="text-2xl font-bold mb-6 text-center">
        {editingProduct ? "Editar Item" : "Agregar Nuevo Item"}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="code" className="label">
            Codigo:
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border sm:text-sm border-primary"
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
            className="mt-1 block w-full px-4 py-2 border sm:text-sm border-primary"
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
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm border-primary"
            placeholder="Ej: Truper"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="images" className="label">
            Imágenes o Fotos:
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full"
            accept="image/*"
            multiple
          />
          {imageFiles.length > 0 && (
            <p className="text-xs text-gray-500">
              {imageFiles.length} archivo(s) seleccionado(s): {imageFiles.map(f => f.name).join(", ")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="price" className="label">
            Precio ($):
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm border-primary"
            placeholder="Ej: 45.50"
            required
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="label">
            Stock / Cantidad:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm border-primary"
            placeholder="Ej: 100"
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
            className="mt-1 block w-full px-4 py-2 border rounded-md sm:text-sm border-primary"
            placeholder="Ej: Herramientas Manuales"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">
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
        {notification.Text && (
          <div className="badge badge-primary">
            {notification.Text}
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
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200 mt-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Ultimos Productos Agregados
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
                  <span className="font-semibold">Codigo:</span> {product.code}
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
                          src={(
                            typeof img === "string" ? img : img.image
                          ) || undefined}
                          alt={`Imagen de ${product.name} ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-md border border-gray-300 transition-transform transform hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/80x80/cccccc/333333?text=No+Img`;
                            e.currentTarget.alt = "Imagen no disponible";
                          }}
                        />
                      ))
                    ) : (
                      <span className="text-primary text-xs">
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
                  onClick={() => onDeleteProduct(String(product.id))}
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
  )
}
export default Items;
