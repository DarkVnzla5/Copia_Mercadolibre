import React, { useState, useMemo } from "react";
import { useDolar } from "../hooks/useDolar";

// Interface para el producto guardado
interface Product {
  id: number;
  nombre: string;
  precioLote: number;
  cantidad: number;
  unidad: string;
}

const Pedidos: React.FC = () => {
  const { dolarData: bcvRate, loading } = useDolar();

  // Estados de configuración (Factores) - Usamos strings para manejo fluido de inputs
  const [ivaFactor, setIvaFactor] = useState<string>("16");
  const [gainFactor, setGainFactor] = useState<string>("30");
  const [freightFactor, setFreightFactor] = useState<string>("10");

  const [products, setProducts] = useState<Product[]>([]);

  // Formulario con strings vacíos para evitar el "0" fastidioso
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precioLote: "",
    cantidad: "",
    unidad: "Unidades",
  });

  // --- Manejadores de Input ---

  const handleNumericInput = (val: string) => val.replace(",", ".");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const precio = parseFloat(newProduct.precioLote);
    const cant = parseFloat(newProduct.cantidad);

    if (newProduct.nombre.trim() && !isNaN(precio) && !isNaN(cant)) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          nombre: newProduct.nombre,
          precioLote: precio,
          cantidad: cant,
          unidad: newProduct.unidad,
        },
      ]);
      // Limpiamos el formulario
      setNewProduct({ nombre: "", precioLote: "", cantidad: "", unidad: "Unidades" });
    }
  };

  // --- Cálculos Memoizados ---

  const calculatedItems = useMemo(() => {
    const rateBCV = bcvRate || 0;
    const iva = (parseFloat(ivaFactor) || 0) / 100;
    const gain = (parseFloat(gainFactor) || 0) / 100;
    const freight = (parseFloat(freightFactor) || 0) / 100;

    return products.map((p) => {
      // Costo Base por cada unidad (ej: costo de 1kg si el lote es de 20kg)
      const baseUnitUSD = p.precioLote / p.cantidad;

      // Aplicación de factores: Costo * IVA * Ganancia * Flete
      const finalUnitUSD = baseUnitUSD * (1 + iva) * (1 + gain) * (1 + freight);

      return {
        ...p,
        baseUnitUSD,
        finalUnitUSD,
        finalUnitVES_BCV: finalUnitUSD * Number(rateBCV),
      };
    });
  }, [products, bcvRate, ivaFactor, gainFactor, freightFactor]);

  const formatCur = (val: number, cur: "USD" | "VES") =>
    val.toLocaleString("es-VE", {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 2
    });

  return (
    <div className="min-h-screen bg-base-300 p-4 md:p-10 font-sans text-base-content">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black text-primary italic uppercase tracking-tighter">
            Calculadora <span className="text-secondary">Vuelvan</span>
          </h1>
          <div className="badge badge-outline badge-secondary mt-2 font-mono p-4">
            {loading ? "Cargando BCV..." : `Tasa BCV: ${Number(bcvRate).toFixed(2)} Bs.`}
          </div>
        </header>

        {/* Configuración de Factores (IVA, Ganancia, Flete) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200 p-6 rounded-box shadow-xl mb-8 border border-primary/20">
          <div className="form-control">
            <label className="label-text font-bold text-primary mb-2">IVA (%)</label>
            <input
              className="input input-bordered bg-base-100"
              value={ivaFactor}
              onChange={(e) => setIvaFactor(handleNumericInput(e.target.value))}
            />
          </div>
          <div className="form-control">
            <label className="label-text font-bold text-primary mb-2">Ganancia (%)</label>
            <input
              className="input input-bordered bg-base-100"
              value={gainFactor}
              onChange={(e) => setGainFactor(handleNumericInput(e.target.value))}
            />
          </div>
          <div className="form-control">
            <label className="label-text font-bold text-primary mb-2">Flete (%)</label>
            <input
              className="input input-bordered bg-base-100"
              value={freightFactor}
              onChange={(e) => setFreightFactor(handleNumericInput(e.target.value))}
            />
          </div>
        </div>

        {/* Formulario de carga de productos */}
        <div className="card bg-primary text-primary-content shadow-2xl mb-8 border-none">
          <form onSubmit={handleAddProduct} className="card-body grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="form-control md:col-span-1">
              <label className="label-text text-primary-content font-bold">Producto</label>
              <input
                required
                className="input input-ghost bg-base-100/20 text-white placeholder:text-white/40"
                value={newProduct.nombre}
                onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                placeholder="Descripción"
              />
            </div>
            <div className="form-control">
              <label className="label-text text-primary-content font-bold">Unidad</label>
              <select
                className="select select-ghost bg-base-100/20 text-white"
                value={newProduct.unidad}
                onChange={(e) => setNewProduct({ ...newProduct, unidad: e.target.value })}
              >
                <option className="text-black">Unidades</option>
                <option className="text-black">Pares</option>
                <option className="text-black">Kgs</option>
                <option className="text-black">Rollos</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label-text text-primary-content font-bold">Cant. Lote</label>
              <input
                required
                className="input input-ghost bg-base-100/20 text-white"
                value={newProduct.cantidad}
                onChange={(e) => setNewProduct({ ...newProduct, cantidad: handleNumericInput(e.target.value) })}
                placeholder="Ej: 20"
              />
            </div>
            <div className="form-control">
              <label className="label-text text-primary-content font-bold">Costo Lote ($)</label>
              <input
                required
                className="input input-ghost bg-base-100/20 text-white"
                value={newProduct.precioLote}
                onChange={(e) => setNewProduct({ ...newProduct, precioLote: handleNumericInput(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <button className="btn btn-secondary border-none font-black uppercase shadow-lg">Agregar</button>
          </form>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-base-200 rounded-box shadow-inner overflow-hidden border border-base-content/10">
          <table className="table table-zebra w-full text-center">
            <thead className="bg-neutral text-neutral-content uppercase text-xs">
              <tr>
                <th className="text-left">Item</th>
                <th>Costo Lote ($)</th>
                <th className="text-secondary">Costo por Unidad ($)</th>
                <th className="text-success text-lg font-black">Venta Unit (Bs)</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.map((p) => (
                <tr key={p.id} className="hover:bg-base-100 transition-colors">
                  <td className="text-left">
                    <span className="font-black block uppercase text-sm">{p.nombre}</span>
                    <span className="text-[10px] opacity-60 italic">Costo unitario base: ${p.baseUnitUSD.toFixed(2)}</span>
                  </td>
                  <td className="font-mono text-xs">{formatCur(p.precioLote, "USD")}</td>
                  <td className="font-black text-secondary">{formatCur(p.finalUnitUSD, "USD")}</td>
                  <td className="font-black text-success text-lg">{formatCur(p.finalUnitVES_BCV, "VES")}</td>
                  <td>
                    <button
                      onClick={() => setProducts(products.filter(i => i.id !== p.id))}
                      className="btn btn-circle btn-ghost btn-xs text-error"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-16 text-center opacity-20 font-black uppercase tracking-[0.3em]">
              Sin productos cargados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pedidos;