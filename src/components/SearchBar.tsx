import React, { useState } from "react";
import { GoSearch } from "react-icons/go";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    console.log(searchTerm);
    onSearch(searchTerm);
  };
  return (
    <section className="flex items-center justify-center px-4 py-2   w-full max-w-lg shrink-0">
      <form className="flex-grow" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          className="input input-sm w-52 md:w-96 lg:w-[500px] focus:outline-none"
          placeholder="Buscar productos, marcas y más..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Evita el envío del formulario
              handleSearch();
            }
          }}
        />
      </form>
      {/* Botón principal de búsqueda */}
      <button
        className="btn btn-primary text-xl transition duration-300 hover:scale-[1.02] max-lg:hidden lg:visible"
        onClick={handleSearch}
      >
        Buscar
      </button>
      <button
        className="btn btn-primary text-xl transition duration-300 hover:scale-[1.02] "
        onClick={handleSearch}
      >
        <GoSearch className="h-4 max-lg:visible lg:hidden" />
      </button>
    </section>
  );
};
export default SearchBar;
