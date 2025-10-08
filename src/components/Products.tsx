import React from "react";
import { Link } from "react-router";
import { products } from "../mocks/products";
import { useDolar } from "../hooks/useDolar";

const Products: React.FC = () => {
  const { dolarData } = useDolar();

  return (
    <section>
      {/* Contenedor de la Grilla (Sin cambios, ya maneja la distribución) */}
      <ul className="grid max-lg:grid-cols-1 max-xl:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group block"
          >
            <li
              // === Tarjeta de Producto ===
              // Añadimos 'h-full' para asegurar que todas las tarjetas tengan la misma altura
              // dentro de la fila de la cuadrícula.
              className="card card-compact bg-base-100 shadow-xl overflow-hidden h-full 
                         transition-all duration-300 transform 
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* FIGURA: Contenedor de la imagen
                  La clave es 'aspect-square' y 'w-full' para forzar una proporción 1:1,
                  independientemente de las dimensiones originales de la imagen.
              */}
              <figure className="relative w-full aspect-square overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  // w-full h-full object-cover: Asegura que la imagen llene el espacio cuadrado
                  // sin distorsionarse (la imagen se recorta si es necesario).
                  className="w-3/4 h-3/4 object-cover 
                             transition duration-500 ease-in-out 
                             group-hover:opacity-90 group-hover:scale-105"
                />
              </figure>

              {/* CUERPO DE LA TARJETA */}
              <div className="card-body p-4">
                {/* Título: Usa 'line-clamp-2' para limitar a 2 líneas y evitar que tarjetas 
                    con títulos largos sean más altas que otras. */}
                <h2 className="card-title text-secondary  line-clamp-2 min-h-10">
                  {product.title}
                </h2>

                {/* Precio: Destacado */}
                <div className="text-xl font-bold text-secondary mt-2">
                  <p>{product.price.toFixed(2)} $</p>
                  <p>
                    {dolarData
                      ? // Check if dolarData exists AND is a valid number after conversion
                        `${(product.price * Number(dolarData)).toFixed(1)} Bs.`
                      : "Bs. N/A"}
                  </p>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default Products;
