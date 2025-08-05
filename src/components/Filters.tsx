import { useState, React } from "react";
function Filters() {
  const [minprice, setminPrice] = useState(0);
  const [maxprice, setmaxPrice] = useState(0);

  return (
    <nav className="flex flex-col flex-wrap gap-2 items-center bg-info-content">
      <section className="flex flex-col items-center mb-4 justify-between text-primary p-4 gap-2">
        <div>{minprice > 0 && <span>Desde ${minprice}</span>}</div>
        <div>{maxprice > 0 && <span>Hasta ${maxprice}</span>}</div>
      </section>
      <section className="flex flex-col items-center justify-between gap-2 p-4">
        <div className="flex flex-col gap-4 justify-center ">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="input max-md:hidden transition-all duration-300"
            />
          </div>
          <button className="w-fit btn btn-primary hover:btn-accent ml-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            Buscar
          </button>
        </div>
      </section>
      <section className="flex flex-col flex-nowrap p-4 items-center justify-between gap-2">
        <input
          type="search"
          className="input w-fit"
          placeholder="Precio Minimo"
          onChange={(e) => setminPrice(Number(e.target.value))}
        />
        -
        <input
          type="search"
          className="input w-fit"
          placeholder="Precio Maximo"
          onChange={(e) => setmaxPrice(Number(e.target.value))}
        />
      </section>
      <section className="flex flex-nowrap flex-col items-center justify-between p-5 gap-2">
        <label htmlFor="select">Categoria</label>
        <select id="select" className="select select-bordered w-fit max-w-xs">
          <option value="default">Todos</option>
          <option value="H_M">Herramientas Electricas</option>
          <option value="H_M">Herramientas Manuales</option>
          <option value="P_A">Pintura y Acabados</option>
          <option value="M_T">Mobiliario de Taller</option>
          <option value="P_L">Plomeria y Electricidad</option>
          <option value="P_P"> Proteccion Personal</option>
        </select>
      </section>
    </nav>
  );
}
export default Filters;
