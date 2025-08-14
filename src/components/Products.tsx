import React from "react";
import { products } from "../mocks/products";

const Products: React.FC = () => {
  return (
    <section>
      <ul className="max-lg:gap-4 grid max-sm:items-center max-sm:justify-center lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {products.map((product) => (
          <li
            key={product.id}
            className="card-sm card p-4 gap-2 bg-base-300 shadow-xl m-2"
          >
            <figure>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-w-full h-auto"
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
};
export default Products;
