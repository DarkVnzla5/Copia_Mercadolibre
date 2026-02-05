import React, { useState } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";


const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, isError, error } = useProduct(id || "");
  const { addItem, isActionsLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!item) return;
    try {
      setIsAdding(true);
      await addItem({ productId: String(item.id), quantity: 1 });
      alert("Producto añadido al carrito");
    } catch (e) {
      console.error("Error adding to cart", e);
      alert("Error al añadir al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Cargando detalles...</div>;
  }

  if (isError) {
    return <div className="p-10 text-center text-error">Error: {(error as Error)?.message}</div>;
  }

  if (!item) {
    return <div className="p-10 text-center">Producto no encontrado</div>;
  }

  return (
    <section className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2 p-4">
          <img
            src={
              item.thumbnail ||
              (typeof item.images[0] === "string"
                ? item.images[0]
                : item.images[0]?.image)
            }
            alt={item.title || item.name}
            className="rounded-xl w-full h-auto object-cover aspect-square"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <h2 className="card-title text-3xl font-bold text-primary">
            {item.title || item.name}
          </h2>
          <p className="text-xl font-bold text-secondary">
            {Number(item.price || 0).toFixed(2)} $
          </p>
          <div className="badge badge-outline">{item.category}</div>
          <p className="mt-4 text-base-content/80">
            {item.description || "Sin descripción disponible."}
          </p>
          <div className="card-actions justify-end mt-6">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={isActionsLoading || isAdding}
            >
              {isAdding ? "Añadiendo..." : "Añadir al Carrito"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
