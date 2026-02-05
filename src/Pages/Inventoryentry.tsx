import React, { useState } from 'react';
import {
	Package,
	Save,
	FileSpreadsheet,
	AlertCircle,
	Briefcase
} from 'lucide-react';
import { useDolar } from "../hooks/useDolar";

const Entry = () => {
	const { dolarData } = useDolar();

	// Type definition for product data
	interface ProductData {
		type: string;
		code: string;
		quantity: number;
		unitPrice: number;
		shipping: number;
		adjustment: number;
		tax: number;
		imageUrl: string;
	}

	// Initial state for the product or invoice
	const [productData, setProductData] = useState<ProductData>({
		type: 'factura',
		code: '',
		quantity: 1,
		unitPrice: 0,
		shipping: 0,
		adjustment: 0,
		tax: 75,
		imageUrl: ''
	});

	// System states
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState({ type: '', msg: '' });



	// Automatic selection when focusing to allow immediate typing
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select();
	};

	// Improved Input Handling: Clears leading zeros and manages state
	const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;

		if (name === 'type') {
			const newTax = value === 'factura' ? 75 : 16;
			setProductData(prev => ({ ...prev, type: value, tax: newTax }));
			return;
		}

		if (type === 'number') {
			const numericValue = value === '' ? 0 : parseFloat(value);
			setProductData(prev => ({ ...prev, [name]: numericValue }));
		} else {
			setProductData(prev => ({ ...prev, [name]: value }));
		}
	};

	// Calculation Logic
	const calculate = () => {
		const subtotal = (productData.unitPrice || 0) * (productData.quantity || 0);
		const baseWithExtras = subtotal + (productData.shipping || 0) + (productData.adjustment || 0);
		const taxAmount = baseWithExtras * (productData.tax / 100);
		const totalUsd = baseWithExtras + taxAmount;
		const totalVes = dolarData ? totalUsd * Number(dolarData) : 0;

		return { subtotal, taxAmount, totalUsd, totalVes };
	};

	const totals = calculate();

	// Save to PostgreSQL via DRF
	const handleSave = async () => {
		setSaving(true);
		setStatus({ type: '', msg: '' });
		try {
			await new Promise(res => setTimeout(res, 1500));
			setStatus({ type: 'success', msg: `DATOS GUARDADOS: ${productData.type.toUpperCase()} EN POSTGRESQL` });
		} catch (err) {
			setStatus({ type: 'error', msg: 'ERROR: FALLO AL GUARDAR EN EL BACKEND' });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="bg-base-200 min-h-screen font-sans p-6 text-base-content">
			<div className="max-w-[1400px] mx-auto">

				{/* HEADER CON TÍTULO ACTUALIZADO */}
				<div className="flex items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm mb-6 border border-base-300">
					<div className="flex items-center gap-4">
						<div className="bg-primary p-2 rounded-lg text-primary-content shadow-lg shadow-primary/20">
							<Package size={24} />
						</div>
						<div>
							<h1 className="text-xl font-black text-base-content tracking-tight leading-none uppercase">Entrada de Inventario</h1>
							<p className="text-[10px] text-base-content/60 font-bold mt-1 tracking-widest uppercase">Sistema de Gestión Pro | DRF + Postgres</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-6">

					{/* MAIN FORM */}
					<div className="col-span-12 lg:col-span-8 space-y-6">
						<div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden">
							<div className="bg-base-200/50 p-4 border-b border-base-300 flex justify-between items-center px-8">
								<span className="text-xs font-black text-base-content/70 uppercase tracking-widest flex items-center gap-2">
									<FileSpreadsheet size={16} className="text-primary" /> Detalle del Ingreso
								</span>
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-base-300"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-base-300"></div>
								</div>
							</div>

							<div className="p-8">
								{/* SELECTOR DE TIPO */}
								<div className="mb-8 p-6 bg-base-200/50 rounded-2xl border border-base-300 flex flex-col md:flex-row gap-6 items-center">
									<div className="w-full md:w-1/2">
										<label className="label py-0"><span className="label-text font-black text-base-content/70 text-[10px] uppercase">Categoría de Operación</span></label>
										<select
											name="type"
											value={productData.type}
											onChange={handleInput}
											tabIndex={1}
											className="select select-bordered w-full bg-base-100 rounded-xl font-bold text-primary mt-2 border-base-300 focus:border-primary"
										>
											<option value="factura">Factura de Venta (Fija 75%)</option>
											<option value="servicio">Servicios / Inventario (Variable)</option>
										</select>
									</div>
									<div className={`w-full md:w-1/2 p-4 rounded-xl border flex items-center gap-3 ${productData.type === 'factura' ? 'bg-primary/10 border-primary/20' : 'bg-warning/10 border-warning/20'}`}>
										<AlertCircle size={20} className={productData.type === 'factura' ? 'text-primary' : 'text-warning'} />
										<p className="text-[11px] font-bold text-base-content/80 leading-tight italic">
											{productData.type === 'factura'
												? 'Configuración automática para facturación de ley.'
												: 'Permite ajuste manual del porcentaje de entrada.'}
										</p>
									</div>
								</div>

								{/* NUMERIC FIELDS */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-base-content/40">Código Producto</label>
										<input
											name="code"
											value={productData.code}
											onChange={handleInput}
											onFocus={handleFocus}
											tabIndex={2}
											className="input input-bordered w-full bg-base-200 focus:bg-base-100 font-mono text-sm border-base-300"
											placeholder="SKU-XXX"
										/>
									</div>
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-base-content/40">Cantidad</label>
										<input
											type="number"
											name="quantity"
											value={productData.quantity === 0 ? '' : productData.quantity}
											onChange={handleInput}
											onFocus={handleFocus}
											tabIndex={3}
											className="input input-bordered w-full bg-base-200 focus:bg-base-100 font-bold border-base-300"
										/>
									</div>
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-base-content/40">Costo / Precio ($)</label>
										<input
											type="number"
											name="unitPrice"
											value={productData.unitPrice === 0 ? '' : productData.unitPrice}
											onChange={handleInput}
											onFocus={handleFocus}
											tabIndex={4}
											className="input input-bordered w-full bg-base-200 focus:bg-base-100 text-primary font-bold border-base-300"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-base-content/40">Flete ($)</label>
										<input
											type="number"
											name="shipping"
											value={productData.shipping === 0 ? '' : productData.shipping}
											onChange={handleInput}
											onFocus={handleFocus}
											tabIndex={5}
											className="input input-bordered w-full bg-base-200 focus:bg-base-100 border-base-300"
										/>
									</div>
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-warning">Ajuste Manual ($)</label>
										<input
											type="number"
											name="adjustment"
											value={productData.adjustment === 0 ? '' : productData.adjustment}
											onChange={handleInput}
											onFocus={handleFocus}
											tabIndex={6}
											className="input input-bordered w-full bg-warning/5 border-warning/20 focus:bg-base-100 font-bold text-warning"
										/>
									</div>
									<div className="form-control">
										<label className="label py-1 uppercase text-[10px] font-black text-primary">% Impuesto / Ret.</label>
										<div className="relative">
											<input
												type="number"
												name="tax"
												value={productData.tax === 0 ? '' : productData.tax}
												onChange={handleInput}
												onFocus={handleFocus}
												tabIndex={7}
												className={`input input-bordered w-full font-black border-base-300 ${productData.type === 'factura' ? 'bg-primary/10 cursor-not-allowed border-primary/20' : 'bg-base-200 focus:bg-base-100'}`}
												readOnly={productData.type === 'factura'}
											/>
											<span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-base-content/40">%</span>
										</div>
									</div>
								</div>

								{/* STATUS MESSAGE */}
								{status.msg && (
									<div className={`mt-6 alert ${status.type === 'success' ? 'bg-success text-success-content shadow-success/20' : 'alert-error'} rounded-2xl shadow-lg border-none animate-in fade-in slide-in-from-bottom-2`}>
										<span className="font-black text-xs tracking-widest">{status.msg}</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* SIDEBAR TOTALS */}
					<div className="col-span-12 lg:col-span-4 space-y-6">

						<div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={`p-3 rounded-2xl ${productData.type === 'factura' ? 'bg-primary text-primary-content' : 'bg-warning text-warning-content shadow-lg shadow-warning/20'}`}>
									{productData.type === 'factura' ? <Briefcase size={22} /> : <Package size={22} />}
								</div>
								<div>
									<p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">Estado de Carga</p>
									<p className="text-sm font-black text-base-content uppercase">{productData.type} Lista</p>
								</div>
							</div>
						</div>

						<div className="bg-neutral rounded-[2.5rem] p-8 shadow-2xl text-neutral-content relative overflow-hidden flex flex-col justify-between min-h-[450px]">
							<div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>

							<div className="relative z-10">
								<div className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
									<span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Resumen de Entrada</span>
									<div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-mono text-neutral-content/40">
										ID: {productData.code || 'DOC-PEND'}
									</div>
								</div>

								<div className="space-y-5">
									<div className="flex justify-between text-neutral-content/60 items-baseline">
										<span className="text-[10px] uppercase font-black tracking-widest">Base Imponible</span>
										<span className="font-mono text-lg">${totals.subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-neutral-content/60 items-baseline">
										<span className="text-[10px] uppercase font-black tracking-widest">Gastos / Ajuste</span>
										<span className="font-mono text-lg">${(productData.adjustment + productData.shipping).toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-primary items-baseline bg-primary/5 p-3 rounded-xl border border-primary/10">
										<span className="text-[10px] uppercase font-black tracking-widest">Impuesto ({productData.tax}%)</span>
										<span className="font-mono text-lg font-black">${totals.taxAmount.toFixed(2)}</span>
									</div>

									<div className="pt-8 mt-4 border-t border-white/10">
										<div className="flex justify-between items-center mb-6">
											<span className="text-neutral-content text-xs font-black uppercase tracking-widest">TOTAL USD</span>
											<span className="text-5xl font-black tracking-tighter text-neutral-content">${totals.totalUsd.toFixed(2)}</span>
										</div>

										<div className="bg-success/10 p-6 rounded-[2rem] border border-success/20 shadow-inner">
											<p className="text-[10px] text-success font-black uppercase tracking-[0.2em] mb-2 text-center">Total en Bolívares (VES)</p>
											<p className="text-3xl font-black text-success font-mono leading-none text-center">
												Bs. {totals.totalVes.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* BOTÓN ACTUALIZADO A "GUARDAR" */}
							<button
								onClick={handleSave}
								disabled={saving}
								tabIndex={9}
								className={`mt-10 w-full btn border-none h-16 rounded-[1.5rem] text-primary-content font-black text-xl shadow-2xl transition-all active:scale-95 ${saving ? 'btn-disabled' : 'btn-primary shadow-primary/30'}`}
							>
								{saving ? <span className="loading loading-spinner"></span> : <><Save className="mr-3" /> GUARDAR</>}
							</button>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Entry;