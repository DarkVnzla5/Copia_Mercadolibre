import React, { useMemo } from "react";
import { Link } from "react-router";
import { products, type Product } from "../mocks/products";
import { useDolar } from "../hooks/useDolar";
import { useFilterStore } from "../stores/useFilterStore";

const useFilteredProducts = (allProducts: Product[]) => {
  const { minPrice, maxPrice, selectedCategory } = useFilterStore();

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === "Todo" || product.category === selectedCategory;
      const minPriceMatch =
        minPrice === null || minPrice <= 0 || product.price >= minPrice;
      const maxPriceMatch =
        maxPrice === null || maxPrice <= 0 || product.price <= maxPrice;
      return categoryMatch && minPriceMatch && maxPriceMatch;
    });
  }, [allProducts, minPrice, maxPrice, selectedCategory]);
  return filteredProducts;
};

const Products: React.FC = () => {
  const { dolarData } = useDolar();
  const filteredProducts = useFilteredProducts(products);

  return (
    <section className="flex-grow p-4">
      {filteredProducts.length === 0 && (
        <div className="alert alert-warning shadow-lg max-w-lg mx-auto ">
          <div>
            <p className="font-bold">Sin Resultados</p>
          </div>
        </div>
      )}
      {filteredProducts.length > 0 && (
        <ul className="grid max-lg:grid-cols-1 max-xl:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {filteredProducts.map((product) => (
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
                  <p className="card-title text-secondary  line-clamp-2 min-h-10">
                    {product.title}
                  </p>

                  {/* Precio: Destacado */}
                  <div className="text-xl font-bold text-secondary mt-2">
                    <p>{product.price.toFixed(2)} $</p>
                    <p>
                      {dolarData
                        ? `${(product.price * Number(dolarData)).toFixed(
                            2
                          )} Bs.`
                        : "Bs. N/A"}
                    </p>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Products;
