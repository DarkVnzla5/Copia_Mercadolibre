import React, { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  Package,
  Save,
  Plus,
  Trash2,
  ShoppingCart,
  Search
} from "lucide-react";
import { useDolar } from "../hooks/useDolar";

const Entry = () => {
  const { dolarData } = useDolar();
  const { products, addProduct } = useProducts();

  // --- DEFINICIÓN DE DATOS ---
  interface ProductData {
    id?: number;
    type: string;
    code: string;
    name: string; // <--- NUEVO CAMPO AGREGADO
    quantity: number;
    unitPrice: number;
    shipping: number;
    adjustment: number;
    tax: number;
    imageUrl: string;
  }

  const initialProductState: ProductData = {
    type: "factura",
    code: "",
    name: "", // <--- INICIALIZACIÓN
    quantity: 0,
    unitPrice: 0,
    shipping: 0,
    adjustment: 0,
    tax: 75,
    imageUrl: "",
  };

  const [productData, setProductData] = useState<ProductData>(initialProductState);
  const [invoiceItems, setInvoiceItems] = useState<ProductData[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // --- MANEJADORES ---
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === "type") {
      const newTax = value === "factura" ? 75 : 0; // Ajusta este 75% o 16% según tu caso real
      setProductData((prev) => ({ ...prev, type: value, tax: newTax }));
      return;
    }

    if (type === "number") {
      const numericValue = value === "" ? 0 : parseFloat(value);
      setProductData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- LÓGICA DE FACTURA ---
  const addToInvoice = () => {
    // Validación: Ahora requerimos el Nombre también
    if (!productData.code || !productData.name || productData.quantity <= 0 || productData.unitPrice <= 0) {
      setStatus({ type: "error", msg: "Faltan datos (Código, Nombre, Cantidad o Precio)." });
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
      return;
    }

    const newItem = { ...productData, id: Date.now() };
    setInvoiceItems([...invoiceItems, newItem]);

    // Limpiamos formulario pero mantenemos configuración base
    setProductData({
      ...initialProductState,
      type: productData.type,
      tax: productData.tax
    });

    // Poner foco en el input de código nuevamente (opcional, requiere useRef)
  };

  const removeFromInvoice = (id: number) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  // --- CÁLCULOS ---
  const totals = useMemo(() => {
    let subtotal = 0;
    let shipping = 0;
    let adjustment = 0;
    let taxAmount = 0;

    invoiceItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemBase = itemSubtotal + item.shipping + item.adjustment;
      const itemTax = itemBase * (item.tax / 100);

      subtotal += itemSubtotal;
      shipping += item.shipping;
      adjustment += item.adjustment;
      taxAmount += itemTax;
    });

    const totalUsd = subtotal + shipping + adjustment + taxAmount;
    const totalVes = dolarData ? totalUsd * Number(dolarData) : 0;

    return { subtotal, shipping, adjustment, taxAmount, totalUsd, totalVes };
  }, [invoiceItems, dolarData]);

  const handleSaveInvoice = async () => {
    setSaving(true);
    // Simulación de guardado
    setTimeout(() => {
      setSaving(false);
      setInvoiceItems([]);
      setStatus({ type: "success", msg: "Factura guardada exitosamente" });
    }, 1500);
  };

  return (
    <div className="bg-base-200 min-h-screen font-sans p-4 md:p-6 text-base-content">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm mb-6 border border-base-300">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-lg text-primary-content shadow-lg shadow-primary/20">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-base-content tracking-tight leading-none uppercase">
                Entrada de Inventario
              </h1>
              <p className="text-[10px] text-base-content/60 font-bold mt-1 tracking-widest uppercase">
                Gestión de Facturas | {invoiceItems.length} Items
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* --- COLUMNA IZQUIERDA (Formulario y Tabla) --- */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* 1. FORMULARIO DE CARGA */}
            <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden">
              <div className="bg-base-200/50 p-3 px-6 border-b border-base-300 flex justify-between items-center">
                <span className="text-xs font-black text-base-content/70 uppercase tracking-widest flex items-center gap-2">
                  <Plus size={16} className="text-primary" /> Nuevo Item
                </span>
              </div>

              <div className="p-6">
                {/* FILA 1: CÓDIGO - NOMBRE - TIPO */}
                <div className="grid grid-cols-12 gap-4 mb-4 items-end">
                  <div className="col-span-3 md:col-span-2 form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Código</label>
                    <div className="relative">
                      <input
                        name="code"
                        value={productData.code}
                        onChange={handleInput}
                        onFocus={handleFocus}
                        className="input input-bordered input-sm w-full font-mono text-xs"
                        placeholder="SKU..."
                      />
                      <Search size={12} className="absolute right-2 top-2 opacity-30" />
                    </div>
                  </div>

                  {/* CAMPO NOMBRE AGREGADO AQUÍ */}
                  <div className="col-span-9 md:col-span-7 form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Nombre del Producto</label>
                    <input
                      name="name"
                      value={productData.name}
                      onChange={handleInput}
                      onFocus={handleFocus}
                      className="input input-bordered input-sm w-full font-bold"
                      placeholder="Ej: Taladro Percutor 1/2..."
                      autoComplete="off"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3 form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Tipo Impuesto</label>
                    <select
                      name="type"
                      value={productData.type}
                      onChange={handleInput}
                      className="select select-bordered select-sm w-full text-xs font-bold"
                    >
                      <option value="factura">Factura (75%)</option>
                      <option value="exento">Exento (0%)</option>
                    </select>
                  </div>
                </div>

                {/* FILA 2: CANTIDAD - PRECIOS - BOTÓN */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                  {/* CAMPO CANTIDAD */}
                  <div className="form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Cantidad</label>
                    <input
                      type="number"
                      name="quantity"
                      value={productData.quantity || ""}
                      onChange={handleInput}
                      onFocus={handleFocus}
                      className="input input-bordered input-sm font-black text-center"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Costo Unit $</label>
                    <input
                      type="number"
                      name="unitPrice"
                      value={productData.unitPrice || ""}
                      onChange={handleInput}
                      onFocus={handleFocus}
                      className="input input-bordered input-sm font-bold text-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50">Flete Total $</label>
                    <input
                      type="number"
                      name="shipping"
                      value={productData.shipping || ""}
                      onChange={handleInput}
                      onFocus={handleFocus}
                      className="input input-bordered input-sm"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1 text-[9px] font-black uppercase opacity-50 text-warning">Ajuste $</label>
                    <input
                      type="number"
                      name="adjustment"
                      value={productData.adjustment || ""}
                      onChange={handleInput}
                      onFocus={handleFocus}
                      className="input input-bordered input-sm text-warning"
                    />
                  </div>

                  <button
                    onClick={addToInvoice}
                    className="btn btn-sm btn-primary w-full shadow-md hover:scale-105 transition-transform col-span-2 md:col-span-1"
                  >
                    <Plus size={16} /> Agregar
                  </button>
                </div>

                {status.msg && (
                  <div className={`mt-4 alert alert-sm py-2 rounded-lg ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                    <span className="text-xs font-bold">{status.msg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TABLA DE DETALLES */}
            {invoiceItems.length > 0 ? (
              <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead className="bg-base-200 text-base-content/60 uppercase font-black text-[10px]">
                      <tr>
                        <th className="pl-6">Código</th>
                        <th>Producto</th> {/* NUEVA COLUMNA */}
                        <th className="text-center">Cant.</th>
                        <th className="text-right">Precio</th>
                        <th className="text-right">Total Base</th>
                        <th className="text-right">Imp.</th>
                        <th className="text-center pr-6">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {invoiceItems.map((item, index) => {
                        const sub = (item.quantity * item.unitPrice) + item.shipping + item.adjustment;
                        const tx = sub * (item.tax / 100);
                        return (
                          <tr key={index} className="hover:bg-base-200/50 border-base-200">
                            <td className="pl-6 font-mono opacity-70">{item.code}</td>
                            <td className="font-bold text-base-content">{item.name}</td> {/* NOMBRE */}
                            <td className="text-center font-bold">{item.quantity}</td>
                            <td className="text-right opacity-80">${item.unitPrice.toFixed(2)}</td>
                            <td className="text-right font-black text-primary">${sub.toFixed(2)}</td>
                            <td className="text-right opacity-70">${tx.toFixed(2)}</td>
                            <td className="text-center pr-6">
                              <button
                                onClick={() => item.id && removeFromInvoice(item.id)}
                                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-base-300 rounded-3xl opacity-50">
                <p className="text-sm font-bold">La factura está vacía</p>
                <p className="text-xs">Agrega productos usando el formulario de arriba</p>
              </div>
            )}
          </div>

          {/* --- COLUMNA DERECHA (Totales) --- */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

            <div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-secondary text-secondary-content">
                <ShoppingCart size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black opacity-50 uppercase">Estado Factura</p>
                <p className="text-sm font-black uppercase">{invoiceItems.length} Productos Cargados</p>
              </div>
            </div>

            {/* RESUMEN FINANCIERO */}
            <div className="bg-neutral rounded-[2.5rem] p-8 shadow-2xl text-neutral-content relative overflow-hidden flex-1 flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>

              <div className="relative z-10 space-y-4">
                <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-end">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Totales</span>
                  <span className="text-[9px] opacity-40 font-mono">USD</span>
                </div>

                {/* DESGLOSE */}
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between items-center text-neutral-content/60">
                    <span>Subtotal Neto</span>
                    <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-content/60">
                    <span>(+) Fletes Globales</span>
                    <span className="font-mono">${totals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-warning/80">
                    <span>(+/-) Ajustes</span>
                    <span className="font-mono">${totals.adjustment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary font-bold bg-white/5 p-3 rounded-xl">
                    <span>(+) Impuestos Total</span>
                    <span className="font-mono">${totals.taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* TOTALES FINALES */}
                <div className="pt-8 mt-4 border-t border-white/10 space-y-6">

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-neutral-content/50 mb-1">Total a Pagar (USD)</p>
                    <p className="text-5xl font-black tracking-tighter text-white leading-none">
                      ${totals.totalUsd.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-base-100 p-5 rounded-3xl border border-white/10 shadow-lg transform scale-100 lg:scale-105 origin-bottom-right">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-base-content/50 uppercase tracking-widest">Bolívares</span>
                      <span className="badge badge-xs badge-ghost font-mono text-[9px] opacity-70">Tasa: {dolarData}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-black text-base-content/40 font-mono">Bs.</span>
                      <span className="text-3xl font-black text-base-content font-mono tracking-tight text-right truncate pl-2">
                        {totals.totalVes.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveInvoice}
                  disabled={saving || invoiceItems.length === 0}
                  className={`mt-4 w-full btn border-none h-14 rounded-2xl font-black text-lg shadow-xl transition-all ${saving || invoiceItems.length === 0 ? "btn-disabled bg-white/10 text-white/20" : "btn-primary text-primary-content hover:scale-[1.02]"
                    }`}
                >
                  {saving ? <span className="loading loading-dots"></span> : (
                    <>
                      <Save size={20} /> GUARDAR FACTURA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Entry;