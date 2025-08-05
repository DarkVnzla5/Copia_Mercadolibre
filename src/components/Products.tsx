import React from "react";
import { products } from "../mocks/products";
function Products() {
  return (
    <section>
      <ul className="max-lg:gap-4 grid max-sm:items-center max-sm:justify-center lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {products.map((product) => (
          <li
            key={product.id}
            className="card-sm card w-96 gap-2 p-5 bg-neutral shadow-xl"
          >
            <figure>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="aspect-video h-full w-full block"
              />
            </figure>
            <div className="text-primary card-title">
              <p>{product.title}</p>
            </div>
            <div className="text-primary card-title">
              <p>{product.price} $</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default Products;
