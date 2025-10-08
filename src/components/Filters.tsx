import React, { useState } from "react";
// Importamos un ícono para el botón de búsqueda.

const Filters: React.FC = () => {
  const [minPrice, setMinPrice] = useState<number | "">(""); // Uso string | number para manejar el input vacío
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedCategory, setSelectedCategory] = useState("Todo");

  // Lista de categorías para hacer el componente más dinámico
  const categories = [
    "Todo",
    "Herramientas Eléctricas",
    "Herramientas Manuales",
    "Pintura y Acabados",
    "Mobiliario de Taller",
    "Plomería y Electricidad",
    "Protección Personal",
  ];

  // Por ejemplo, una llamada a una API o a una función de filtro global.

  return (
    // Contenedor principal: una barra lateral clara y limpia.
    // Usamos 'sticky top-0' si quieres que la barra se quede fija al hacer scroll.
    <nav className="flex flex-col w-64 p-4 bg-base-100 shadow-xl rounded-box">
      <h2 className="text-xl font-bold mb-4 text-primary">
        Filtros de Productos
      </h2>

      {/* 1. SECCIÓN DE BÚSQUEDA Y ACCIÓN PRINCIPAL */}

      {/* 2. SECCIÓN RANGO DE PRECIOS */}
      <section className="mb-6 p-2">
        <h3 className="text-lg font-semibold mb-2 text-info">
          Rango de Precio
        </h3>

        {/* Indicadores de precio seleccionado */}
        <div className="flex flex-col text-lg font-bold mb-3 text-secondary">
          {minPrice !== "" && minPrice > 0 && (
            <span>Desde: ${minPrice.toFixed(2)}</span>
          )}
          {maxPrice !== "" && maxPrice > 0 && (
            <span>Hasta: ${maxPrice.toFixed(2)}</span>
          )}
          {(minPrice === 0 || minPrice === "") &&
            (maxPrice === 0 || maxPrice === "") && <span>Todo</span>}
        </div>

        {/* Inputs de Precio */}
        <div className="flex flex-col gap-3">
          <input
            type="number" // Cambiado a number para mejor UX en móviles y validación
            className="input input-bordered input-sm w-full"
            placeholder="Precio Mínimo ($)"
            value={minPrice}
            min="0"
            onChange={(e) => setMinPrice(Number(e.target.value) || "")} // Maneja el input vacío
          />
          <div className="divider my-0 text-xs text-info/50">Y</div>
          <input
            type="number" // Cambiado a number
            className="input input-bordered input-sm w-full"
            placeholder="Precio Máximo ($)"
            value={maxPrice}
            min="0"
            onChange={(e) => setMaxPrice(Number(e.target.value) || "")}
          />
        </div>
      </section>

      {/* 3. SECCIÓN DE CATEGORÍAS (Usando DaisyUI "Choice") */}
      <section className="mb-4 p-2">
        <h3 className="text-lg font-semibold mb-2 text-info">Categorías</h3>

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
          setMinPrice("");
          setMaxPrice("");
          setSelectedCategory("Todo");
        }}
      >
        Limpiar Todos los Filtros
      </button>
    </nav>
  );
};

export default Filters;
