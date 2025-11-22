import React, { useState, useMemo, useCallback } from "react";
import { useDolar } from "../hooks/useDolar";

// --- Interfaces de Tipos ---

// 1. Interfaz base para los productos
interface Product {
  id: number;
  nombre: string;
  precio: number; // Precio unitario en USD
  cantidad: number;
}

// 2. Interfaz para los cálculos extendidos
interface CalculatedProduct extends Product {
  // Costos intermedios y finales
  costUSD: number; // Costo Total (cantidad * precio)
  costBS: number; // Costo Total VES @ BCV
  costBSWithIVA: number; // Costo + IVA VES @ BCV
  costBsWithGanancia: number; // Costo + IVA + Ganancia VES @ BCV
  costBSFinal: number; // Precio de Venta Final VES @ BCV

  finalCostUSD: number; // Precio de Venta Final en USD
  finalCostBSFixed: number; // Precio de Venta Final VES @ Tasa Fija
}

// --- Componente Principal ---

const Pedidos: React.FC = () => {
  // --- Estados y Hooks ---
  const { dolarData: bcvRate, loading, error } = useDolar();
  // Tasa BCV ahora manejada por estado local y con un valor inicial

  const [products, setProducts] = useState<Product[]>([]);
  const [fixedRate, setFixedRate] = useState<number>(0); // Tasa fija inicial

  // Factores de Cálculo (Editable): Se guardan como factor decimal (0.16)
  const [ivaFactor, setIvaFactor] = useState<number>(0.16);
  const [gainFactor, setGainFactor] = useState<number>(0.3);
  const [freightFactor, setFreightFactor] = useState<number>(0.1); // Usamos freightFactor para "Exento - Flete"

  // Estado para el formulario de nuevo producto
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precio: 0,
    cantidad: 1,
  });

  // --- Handlers de Configuración ---

  const handleRateChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setter(num);
    }
  };

  const handleFactorChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      // Almacenamos el valor como factor (e.g., 16 -> 0.16)
      setter(num / 100);
    } else {
      setter(0);
    }
  };

  // --- Handlers de Producto ---

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number;

    if (type === "number") {
      parsedValue = parseFloat(value);
      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;
    } else {
      parsedValue = value;
    }

    setNewProduct((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, cantidad, precio } = newProduct;

    if (nombre.trim() && cantidad > 0 && precio >= 0) {
      const newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;

      setProducts((prev) => [
        ...prev,
        {
          ...newProduct,
          id: newId,
          nombre: nombre.trim(),
        },
      ]);
      setNewProduct({ nombre: "", cantidad: 1, precio: 0 });
    }
  };

  const handleDeleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // --- Cálculos de Costos y Totales (Memoizados) ---

  const { calculatedProducts, totals } = useMemo(() => {
    const calculated: CalculatedProduct[] = products.map((product) => {
      // 1. Costo Total (USD)
      const costUSD = product.precio;

      // 2. Multiplicadores de Marcado (Markup)
      const multiplierIVA = 1 + ivaFactor;
      const multiplierGain = 1 + gainFactor;
      const multiplierFreight = 1 + freightFactor;

      // 3. Cálculos de Costos Intermedios
      const costBS = costUSD * bcvRate;
      const costBSWithIVA = costUSD * multiplierIVA * bcvRate;
      const costBsWithGanancia =
        costUSD * multiplierIVA * multiplierGain * bcvRate;

      // 4. Precio de Venta Final
      const finalCostUSD =
        costUSD * multiplierIVA * multiplierGain * multiplierFreight;
      const costBSFinal = finalCostUSD * bcvRate; // Final Price VES @ BCV
      const finalCostBSFixed = finalCostUSD * fixedRate; // Final Price VES @ Tasa Fija

      return {
        ...product,
        costUSD,
        costBS,
        costBSWithIVA,
        costBsWithGanancia,
        costBSFinal,
        finalCostUSD,
        finalCostBSFixed,
      };
    });

    // Sumar todos los totales para el pie de tabla
    const totalCostUSD = calculated.reduce((sum, p) => sum + p.costUSD, 0);
    const totalFinalCostUSD = calculated.reduce(
      (sum, p) => sum + p.finalCostUSD,
      0
    );
    const totalFinalCostBSFixed = calculated.reduce(
      (sum, p) => sum + p.finalCostBSFixed,
      0
    );
    const totalCostBSFinal = calculated.reduce(
      (sum, p) => sum + p.costBSFinal,
      0
    );

    return {
      calculatedProducts: calculated,
      totals: {
        totalCostUSD,
        totalFinalCostUSD,
        totalFinalCostBSFixed,
        totalCostBSFinal,
      },
    };
  }, [products, fixedRate, bcvRate, ivaFactor, gainFactor, freightFactor]);

  // --- Formato de Moneda ---
  const formatCurrency = (value: number, currency: "USD" | "VES") => {
    return value.toLocaleString("es-VE", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "VES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // --- Renderizado ---

  return (
    <div className="min-h-screen bg-base-100 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">
          Calculadora de Costos y Precios de Venta
        </h1>

        {/* Bloque de Tasas y Factores */}
        <div className="card bg-base-200 shadow-xl mb-8 p-6 border-t-4 border-accent">
          <h2 className="text-2xl font-bold mb-4 text-secondary text-center border-b pb-2">
            Configuración de Tasas y Factores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Tasa BCV (Ahora Editable) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Tasa BCV (VES/USD)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full text-lg font-bold"
                value={
                  loading
                    ? "Cargando Dólar..."
                    : error
                    ? "Error al cargar Dólar"
                    : bcvRate
                    ? ` ${bcvRate.toFixed(2)} Bs.`
                    : "Dólar: N/A"
                }
              />
              <p className="text-xs text-neutral-content mt-1">
                Ingreso manual
              </p>
            </div>

            {/* Tasa Fija */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tasa Fija (BS)</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full text-lg font-bold"
                value={fixedRate}
                onChange={(e) => handleRateChange(setFixedRate, e.target.value)}
                step="0.01"
                min="0"
              />
              <p className="text-xs text-neutral-content mt-1">
                Binance / Euros
              </p>
            </div>

            {/* IVA (%) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">IVA (%)</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full text-lg font-bold"
                value={(ivaFactor * 100).toFixed(2)}
                onChange={(e) =>
                  handleFactorChange(setIvaFactor, e.target.value)
                }
                step="1"
                min="0"
              />
              <p className="text-xs text-neutral-content mt-1">
                Valor sin porcentaje (ej: 16)
              </p>
            </div>

            {/* Ganancia (%) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Ganancia (%)</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full text-lg font-bold"
                value={(gainFactor * 100).toFixed(1)}
                onChange={(e) =>
                  handleFactorChange(setGainFactor, e.target.value)
                }
                step="1"
                min="0"
              />
              <p className="text-xs text-neutral-content mt-1">
                Valor sin porcentaje (ej: 30)
              </p>
            </div>

            {/* Exento - Flete (%) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Exento - Flete (%)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full text-lg font-bold"
                value={(freightFactor * 100).toFixed(0)}
                onChange={(e) =>
                  handleFactorChange(setFreightFactor, e.target.value)
                }
                step="1"
                min="0"
              />
              <p className="text-xs text-neutral-content mt-1">
                Factor de Costo (ej: 10)
              </p>
            </div>
          </div>
        </div>

        {/* Bloque de Carga de Producto */}
        <div className="card bg-base-100 shadow-xl mb-8 p-6 border-t-4 border-primary">
          <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">
            Añadir Producto
          </h2>
          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
          >
            {/* Nombre */}
            <div className="form-control col-span-2 md:col-span-1">
              <label className="label">
                <span className="label-text">Nombre del Producto</span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Zapatos Deportivos"
                className="input input-bordered w-full text-secondary text-lg font-bold"
                value={newProduct.nombre}
                onChange={handleNewProductChange}
                required
              />
            </div>

            {/* Precio Unitario (USD) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">P. Unitario (USD)</span>
              </label>
              <input
                type="number"
                name="precio"
                placeholder="10.50"
                className="input input-bordered w-full text-secondary text-lg font-bold"
                value={newProduct.precio}
                onChange={handleNewProductChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Cantidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text ">Cantidad</span>
              </label>
              <input
                type="number"
                name="cantidad"
                placeholder="1"
                className="input input-bordered w-full text-secondary text-lg font-bold"
                value={newProduct.cantidad}
                onChange={handleNewProductChange}
                required
              />
            </div>

            {/* Botón Añadir */}
            <button
              type="submit"
              className="btn btn-primary w-full col-span-2 md:col-span-1 text-secondary text-lg font-bold"
            >
              Añadir Producto
            </button>
          </form>
        </div>

        {/* Bloque de Tabla de Resultados */}
        <div className="card bg-base-100 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 p-6 text-primary border-b">
            Articulos Agregados: {products.length === 0 ? "" : products.length}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <p>
                No hay productos cargados. ¡Añade productos para ver los
                cálculos!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full table-zebra">
                {/* Cabecera */}
                <thead>
                  <tr className="bg-base-200">
                    <th className="w-[3%]">#</th>
                    <th className="w-[15%]">Producto</th>
                    <th className="w-[8%] text-center">Cant.</th>
                    <th className="w-[10%] text-right">Costo ($)</th>
                    <th className="w-[12%] text-right">Costo * BCV</th>
                    <th className="w-[12%] text-right">Costo Total</th>
                    <th className="w-[15%] text-right text-primary">
                      Venta Final (*Binance)
                    </th>
                    <th className="w-[15%] text-right text-secondary">
                      Venta Final (VES BCV)
                    </th>
                    <th className="w-[5%] text-center">Acción</th>
                  </tr>
                </thead>
                {/* Cuerpo */}
                <tbody>
                  {calculatedProducts.map((p, index) => (
                    <tr key={p.id} className="hover:bg-base-100">
                      <td>{index + 1}</td>
                      <td className="font-semibold">{p.nombre}</td>
                      <td className="text-center">{p.cantidad}</td>
                      <td className="text-right font-bold text-success">
                        {formatCurrency(p.costUSD, "USD")}
                      </td>
                      <td className="text-right text-base-content/70">
                        {formatCurrency(p.costBS, "VES")}
                      </td>
                      <td className="text-right text-warning font-extrabold">
                        {formatCurrency(p.finalCostUSD, "USD")}
                      </td>
                      {/* Precio de Venta Final VES (Tasa Fija) */}
                      <td className="text-right text-primary font-medium">
                        {formatCurrency(p.finalCostBSFixed, "VES")}
                      </td>
                      {/* Precio de Venta Final VES (Tasa BCV) - Este es el costBSFinal */}
                      <td className="text-right text-secondary font-bold">
                        {formatCurrency(p.costBSFinal, "VES")}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleDeleteProduct(p.id)}
                          aria-label={`Eliminar producto ${p.nombre}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Pie de Tabla (Totales) */}
                <tfoot>
                  <tr className="bg-neutral text-neutral-content font-extrabold text-lg">
                    <td colSpan={3} className="text-right">
                      TOTALES
                    </td>
                    {/* Total Costo Real USD */}
                    <td className="text-right">
                      {formatCurrency(totals.totalCostUSD, "USD")}
                    </td>
                    <td></td> {/* Costo Total VES @ BCV no sumado */}
                    {/* Total Precio Venta Final USD */}
                    <td className="text-right">
                      {formatCurrency(totals.totalFinalCostUSD, "USD")}
                    </td>
                    {/* Total Venta Final VES Fija */}
                    <td className="text-right text-primary">
                      {formatCurrency(totals.totalFinalCostBSFixed, "VES")}
                    </td>
                    {/* Total Venta Final VES BCV */}
                    <td className="text-right text-secondary">
                      {formatCurrency(totals.totalCostBSFinal, "VES")}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Pedidos;
