import React from "react";
import Products from "../components/Products";
import Filters from "../components/Filters";
// import { useProductStore } from "../stores/itemsStore"; // Importamos el store

const Home: React.FC = () => {
  // 1. Leemos el estado global: ¿Se ha realizado ya una búsqueda inicial?

  // 2. Definición de clases del grid basada en el estado global

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Filters />
        </div>
        <div className="md:col-span-3">
          <Products />
        </div>
      </div>
    </div>
  );
};
export default Home;
