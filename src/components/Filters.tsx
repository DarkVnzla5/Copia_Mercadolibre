import React from "react";
import { useFilterStore } from "../stores/useFilterStore";

const categories = [
  "Todo",
  "Herramientas Eléctricas",
  "Herramientas Manuales",
  "Pintura y Acabados",
  "Mobiliario de Taller",
  "Plomería y Electricidad",
  "Protección Personal",
];

const Filters: React.FC = () => {
  const {
    minPrice,
    maxPrice,
    selectedCategory,
    setMinPrice,
    setMaxPrice,
    setSelectedCategory,
    resetFilters,
  } = useFilterStore();

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = value === "" ? null : Number(value);
    setMinPrice(price);
  };
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = value === "" ? null : Number(value);
    setMaxPrice(price);
  };
  const minPriceValue: string | number = minPrice === null ? "" : minPrice;
  const maxPriceValue: string | number = maxPrice === null ? "" : maxPrice;
  // Lista de categorías para hacer el componente más dinámico

  // Por ejemplo, una llamada a una API o a una función de filtro global.

  return (
    // Contenedor principal: una barra lateral clara y limpia.
    // Usamos 'sticky top-0' si quieres que la barra se quede fija al hacer scroll.
    <nav className="flex flex-col w-full lg:w-64 p-4 bg-base-100 shadow-xl rounded-box">
      <h2 className="text-xl font-bold mb-4 text-primary">
        Filtros de Productos
      </h2>

      {/* 2. SECCIÓN RANGO DE PRECIOS */}
      <section className="mb-6 p-2">
        <h3 className="text-lg font-semibold mb-2 text-info">
          Rango de Precio
        </h3>

        {/* Indicadores de precio seleccionado */}
        <div className="flex flex-col text-lg font-bold mb-3 text-secondary">
          {minPriceValue !== null && minPrice > 0 && (
            <span>Desde: ${minPriceValue}</span>
          )}
          {maxPriceValue !== null && maxPrice > 0 && (
            <span>Hasta: ${maxPriceValue}</span>
          )}
          {(minPrice === 0 || minPrice === null) &&
            (maxPrice === 0 || maxPrice === null) && <span>Todo</span>}
          {selectedCategory !== "Todo" && (
            <span>Categoría: {selectedCategory}</span>
          )}
        </div>

        {/* Inputs de Precio */}
        <div className="flex flex-col gap-3">
          <input
            type="number" // Cambiado a number para mejor UX en móviles y validación
            className="input input-bordered input-sm w-full"
            placeholder="Precio Mínimo ($)"
            value={minPriceValue}
            min="0"
            onChange={handleMinPriceChange} // Maneja el input vacío
          />
          <div className="divider my-0 text-xs text-info/50">Y/O</div>
          <input
            type="number" // Cambiado a number
            className="input input-bordered input-sm w-full"
            placeholder="Precio Máximo ($)"
            value={maxPriceValue}
            min="0"
            onChange={handleMaxPriceChange} // Maneja el input vacío
          />
        </div>
      </section>

      {/* 3. SECCIÓN DE CATEGORÍAS (Usando DaisyUI "Choice") */}
      <section className="mb-4 p-2">
        <p className="text-lg font-semibold mb-2 text-info">Categorías</p>

        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <div key={category} className="form-control">
              <label
                className={`label cursor-pointer p-2 rounded-lg transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-content font-bold"
                    : "hover:bg-base-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="label-text text-sm">{category}</span>
                {/* Checkbox invisible que solo sirve para la apariencia de 'choice' */}
                <input
                  type="radio"
                  name="category-choice"
                  className="radio radio-primary radio-xs opacity-0"
                  checked={selectedCategory === category}
                  readOnly
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Botón de Limpiar Filtros */}
      <button
        className="btn btn-ghost btn-sm text-sm mt-4"
        onClick={() => {
          resetFilters();
        }}
      >
        Limpiar Todos los Filtros
      </button>
    </nav>
  );
};

export default Filters;
