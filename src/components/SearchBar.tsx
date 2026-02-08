import React from "react";
import { GoSearch } from "react-icons/go";
// Importamos el store global
import { useFilterStore } from "../stores/useFilterStore";

const SearchBar: React.FC = () => {
  // Conectamos directamente con el store de Zustand
  const { searchQuery, setSearchQuery } = useFilterStore();

  // Función para manejar el envío del formulario (opcional si ya buscas en tiempo real)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías disparar alguna analítica o cerrar un menú móvil
    console.log("Buscando:", searchQuery);
  };

  return (
    <section className="flex items-center justify-center px-4 py-2 w-full max-w-lg shrink-0">
      <form className="flex-grow flex items-center gap-2" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            type="search"
            className="input input-bordered input-md w-full focus:outline-none pr-10"
            placeholder="Buscar productos, marcas..."
            value={searchQuery}
            // Actualiza el store global inmediatamente
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Ícono de lupa dentro del input para móvil */}
          <GoSearch className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden opacity-50" />
        </div>

        {/* Botón visible solo en escritorio */}
        <button
          type="submit"
          className="btn btn-primary hidden lg:flex transition duration-300 hover:scale-[1.02]"
        >
          Buscar
        </button>

        {/* Botón ícono para tablets/móvil si quieres mantener el botón externo */}
        <button
          type="submit"
          className="btn btn-primary lg:hidden flex items-center justify-center"
        >
          <GoSearch className="text-xl" />
        </button>
      </form>
    </section>
  );
};

export default SearchBar;