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
          className="input input-md w-48 md:w-64 lg:w-[360px] focus:outline-none mr-6"
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
      <div className="max-lg:hidden lg:visible">
        <button
          className="btn btn-primary text-xl transition duration-300 hover:scale-[1.02] "
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
      <div className="max-lg:visible lg:hidden">
        <button
          className="btn btn-primary text-xl transition duration-300 hover:scale-[1.02] "
          onClick={handleSearch}
        >
          <GoSearch className="h-4 " />
        </button>
      </div>
    </section>
  );
};
export default SearchBar;
