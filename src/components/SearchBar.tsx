import React from "react";
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
        </div>
      </form>
    </section>
  );
};

export default SearchBar;