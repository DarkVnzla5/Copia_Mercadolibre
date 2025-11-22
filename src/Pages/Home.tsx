import React, { useState } from "react";
import Products from "../components/Products";
import Filters from "../components/Filters";
import { IoIosSearch, IoMdClose } from "react-icons/io";

// import { useProductStore } from "../stores/itemsStore"; // Importamos el store

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex min-h-screen ">
      {/* 1. Componente Filters: Se oculta por defecto en móvil y se muestra condicionalmente. 
          En desktop (md:), siempre se muestra con un ancho de 1/4. */}

      <div
        className={`fixed inset-y-0 left-0 z-30 transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out  w-3/4 max-w-xs md:static md:translate-x-0 
          md:w-1/4 md:border-r md:shadow-xl shadow-2xl`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 flex justify-end md:hidden bg-base-100">
            <button
              onClick={toggleFilter}
              className="p-2  rounded-full "
              aria-label="Cerrar filtros"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <Filters />
        </div>
      </div>

      {/* Overlay para móvil cuando los filtros están abiertos */}
      {isOpen && (
        <div
          className="fixed inset-0 opacity-50 z-20 md:hidden"
          onClick={toggleFilter}
          aria-hidden="true"
        ></div>
      )}

      {/* 2. Componente Products: Toma todo el ancho en móvil y 3/4 en desktop. */}
      <div className="w-full md:w-3/4 flex-grow">
        {/* Cabecera Móvil con el botón de Lupa (visible solo en móvil) */}
        <div className="sticky top-0 z-10  md:hidden p-4 border-b shadow-sm flex justify-between items-center">
          <p className="badge badge-primary badge-xl bg-base-content">
            Catálogo
          </p>

          {/* SVG de Lupa para abrir los filtros */}
          <button
            onClick={toggleFilter}
            className="p-2 rounded-full shadow-lg  transition duration-200 cursor-pointer"
            aria-label="Abrir filtros de búsqueda"
          >
            <IoIosSearch size={20} />
          </button>
        </div>

        {/* Contenido de Productos */}
        <Products />
      </div>
    </div>
  );
};
export default Home;
