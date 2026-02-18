import React, { useState, useEffect, useRef } from "react";
import {
	Edit2,
	Trash2,
	Plus,
	Save,
	X,
	Image as ImageIcon,
	AlertCircle,
	PackageOpen,
	Search,
	UploadCloud
} from "lucide-react";
// Asegúrate de tener estas importaciones o define la interfaz aquí si es necesario
import type { Product } from "../hooks/useProducts";
import { useProducts } from "../hooks/useProducts";

// --- Componente Principal ---

function Items() {
	const {
		products,
		isLoading,
		isError,
		error,
		addProduct,
		updateProduct,
		deleteProduct,
	} = useProducts();

	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const formRef = useRef<HTMLDivElement>(null);

	// Scroll suave hacia el formulario al editar
	const startEditing = (product: Product) => {
		setEditingProduct(product);
		// Pequeño timeout para asegurar que el DOM responda
		setTimeout(() => {
			formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 100);
	};

	const handleAddProduct = async (product: FormData) => {
		try {
			await addProduct(product as any); // Ajuste de tipo según tu hook
		} catch (error) {
			console.error("Error adding product:", error);
			throw error; // Re-lanzar para manejarlo en el formulario
		}
	};

	const handleUpdateProduct = async (productData: { formData: FormData; id: string }) => {
		try {
			await updateProduct(productData as any);
			setEditingProduct(null);
		} catch (error) {
			console.error("Error updating product:", error);
			throw error;
		}
	};

	const handleDeleteProduct = async (id: string) => {
		if (window.confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
			try {
				await deleteProduct(id);
			} catch (error) {
				console.error("Error deleting product:", error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
			<div className="max-w-7xl mx-auto space-y-8">

				{/* Encabezado Simple */}
				<div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-base-300">
					<h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
						<PackageOpen className="w-8 h-8 text-primary" />
						Gestión de Inventario
					</h1>
				</div>

				{/* Mensaje de Error Global */}
				{isError && (
					<div role="alert" className="alert alert-error shadow-lg animate-in fade-in slide-in-from-top-4">
						<AlertCircle className="stroke-current shrink-0 h-6 w-6" />
						<span>{(error as Error)?.message || "Ocurrió un error al cargar los productos."}</span>
					</div>
				)}

				{/* Layout Grid: Formulario (Izquierda/Arriba) - Lista (Derecha/Abajo) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

					{/* Columna Formulario: Ocupa 4 de 12 columnas en pantallas grandes */}
					<div ref={formRef} className="lg:col-span-4 lg:sticky lg:top-8 z-10">
						<ProductForm
							onAddProduct={handleAddProduct}
							onUpdateProduct={handleUpdateProduct}
							editingProduct={editingProduct}
							setEditingProduct={setEditingProduct}
						/>
					</div>

					{/* Columna Lista: Ocupa 8 de 12 columnas */}
					<div className="lg:col-span-8">
						{isLoading ? (
							<div className="flex flex-col items-center justify-center h-64 space-y-4">
								<span className="loading loading-spinner loading-lg text-primary"></span>
								<p className="text-sm uppercase tracking-widest font-semibold text-base-content/60">Cargando catálogo...</p>
							</div>
						) : (
							<ProductList
								products={products}
								onDeleteProduct={handleDeleteProduct}
								onEditProduct={startEditing}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Componente Formulario ---

interface ProductFormProps {
	onAddProduct: (product: FormData) => Promise<void>;
	onUpdateProduct: (product: { formData: FormData; id: string }) => Promise<void>;
	editingProduct: Product | null;
	setEditingProduct: (product: Product | null) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
	onAddProduct,
	onUpdateProduct,
	editingProduct,
	setEditingProduct,
}) => {
	const [formData, setFormData] = useState({
		code: "",
		name: "",
		brand: "",
		category: "",
		price: "",
		quantity: "",
		// Nota: 'images' aquí guarda nombres de archivo o URLs para visualización
		imagesDisplay: "",
	});

	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState({ text: "", type: "" as "success" | "error" | "" });

	// Cargar datos al editar
	useEffect(() => {
		if (editingProduct) {
			setFormData({
				code: editingProduct.code,
				name: editingProduct.name,
				brand: editingProduct.brand || "",
				category: editingProduct.category || "",
				price: String(editingProduct.price),
				quantity: String(editingProduct.quantity),
				imagesDisplay: editingProduct.images.map((img) => typeof img === "string" ? img : img.image).join(", "),
			});
		} else {
			resetForm();
		}
	}, [editingProduct]);

	const resetForm = () => {
		setFormData({
			code: "", name: "", brand: "", category: "", price: "", quantity: "", imagesDisplay: "",
		});
		setImageFiles([]);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setImageFiles(filesArray);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setNotification({ text: "", type: "" });

		try {
			const data = new FormData();
			data.append('code', formData.code);
			data.append('name', formData.name);
			data.append('brand', formData.brand);
			data.append('category', formData.category);
			data.append('price', formData.price);
			data.append('quantity', formData.quantity);

			imageFiles.forEach((file) => {
				data.append('images', file);
			});

			if (editingProduct) {
				await onUpdateProduct({
					formData: data,
					id: String(editingProduct.id)
				});
				setNotification({ text: "¡Producto actualizado exitosamente!", type: "success" });
			} else {
				await onAddProduct(data);
				setNotification({ text: "¡Producto agregado exitosamente!", type: "success" });
				resetForm();
			}

			// Limpiar notificación
			setTimeout(() => setNotification({ text: "", type: "" }), 4000);

		} catch (error: any) {
			const msg = error?.response?.data?.message || "Error al procesar la solicitud.";
			setNotification({ text: msg, type: "error" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
			{/* Barra de título del Formulario */}
			<div className={`p-4 ${editingProduct ? 'bg-secondary/10' : 'bg-primary/10'} border-b border-base-200`}>
				<h2 className="text-xl font-bold flex items-center gap-2">
					{editingProduct ? <Edit2 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-primary" />}
					{editingProduct ? "Editar Producto" : "Nuevo Producto"}
				</h2>
			</div>

			<div className="card-body p-6 gap-0">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">

					<div className="form-control">
						<label htmlFor="code" className="label font-medium text-sm text-base-content/70">Código</label>
						<input
							type="text"
							name="code"
							value={formData.code}
							onChange={handleChange}
							placeholder="Ej: H-001"
							className={`input input-bordered w-full focus:input-primary transition-all ${editingProduct ? 'bg-base-200 cursor-not-allowed' : ''}`}
							required
							disabled={!!editingProduct}
						/>
					</div>

					<div className="form-control">
						<label htmlFor="name" className="label font-medium text-sm text-base-content/70">Nombre</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Ej: Martillo Profesional"
							className="input input-bordered w-full focus:input-primary"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label className="label font-medium text-sm text-base-content/70">Marca</label>
							<input
								type="text"
								name="brand"
								value={formData.brand}
								onChange={handleChange}
								placeholder="Ej: Truper"
								className="input input-bordered w-full focus:input-primary"
								required
							/>
						</div>
						<div className="form-control">
							<label className="label font-medium text-sm text-base-content/70">Categoría</label>
							<input
								type="text"
								name="category"
								value={formData.category}
								onChange={handleChange}
								placeholder="Herramientas"
								className="input input-bordered w-full focus:input-primary"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label className="label font-medium text-sm text-base-content/70">Precio ($)</label>
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handleChange}
								placeholder="0.00"
								className="input input-bordered w-full focus:input-primary"
								step="0.01"
								required
							/>
						</div>
						<div className="form-control">
							<label className="label font-medium text-sm text-base-content/70">Stock</label>
							<input
								type="number"
								name="quantity"
								value={formData.quantity}
								onChange={handleChange}
								placeholder="0"
								className="input input-bordered w-full focus:input-primary"
								required
							/>
						</div>
					</div>

					{/* Input de Archivo Mejorado */}
					<div className="form-control">
						<label className="label font-medium text-sm text-base-content/70">Imágenes</label>
						<div className="relative">
							<input
								type="file"
								onChange={handleFileChange}
								className="file-input file-input-bordered file-input-primary w-full text-sm"
								accept="image/*"
								multiple
							/>
							<UploadCloud className="absolute right-3 top-3 w-5 h-5 text-base-content/40 pointer-events-none" />
						</div>

						{/* Previsualización de archivos seleccionados */}
						{imageFiles.length > 0 && (
							<div className="mt-2 p-2 bg-base-200 rounded-lg text-xs">
								<p className="font-semibold mb-1 text-primary">{imageFiles.length} Archivos listos para subir:</p>
								<ul className="list-disc list-inside opacity-70">
									{imageFiles.map((f, i) => <li key={i} className="truncate">{f.name}</li>)}
								</ul>
							</div>
						)}
						{/* Mostrar información de imágenes existentes si no se han seleccionado nuevas */}
						{editingProduct && imageFiles.length === 0 && (
							<p className="text-xs text-info mt-1 italic">
								* Deja vacío para mantener las imágenes actuales.
							</p>
						)}
					</div>

					{/* Botones de Acción */}
					<div className="flex flex-col gap-2 mt-4">
						<button
							type="submit"
							className={`btn ${editingProduct ? 'btn-secondary' : 'btn-primary'} w-full text-white shadow-md`}
							disabled={isSubmitting}
						>
							{isSubmitting ? <span className="loading loading-spinner"></span> : <Save className="w-4 h-4" />}
							{editingProduct ? "Guardar Cambios" : "Agregar Producto"}
						</button>

						{editingProduct && (
							<button
								type="button"
								onClick={() => setEditingProduct(null)}
								className="btn btn-ghost w-full hover:bg-base-200"
								disabled={isSubmitting}
							>
								<X className="w-4 h-4" /> Cancelar Edición
							</button>
						)}
					</div>

					{/* Notificaciones */}
					{notification.text && (
						<div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2 rounded-lg mt-2`}>
							<span>{notification.text}</span>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

// --- Componente Lista ---

interface ProductListProps {
	products: Product[];
	onDeleteProduct: (id: string) => Promise<void>;
	onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
	products,
	onDeleteProduct,
	onEditProduct,
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredProducts = products.filter(p =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
		p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="space-y-6">

			{/* Barra de búsqueda y título */}
			<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
				<h2 className="text-xl font-bold text-base-content">Inventario Actual</h2>
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
					<input
						type="text"
						placeholder="Buscar por nombre, código..."
						className="input input-bordered input-sm pl-10 w-full rounded-full focus:input-primary"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Grid de Productos */}
			{products.length === 0 ? (
				<div className="text-center py-12 bg-base-100 rounded-xl border border-dashed border-base-300">
					<PackageOpen className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
					<p className="text-lg font-medium text-base-content/60">No hay productos en el inventario.</p>
					<p className="text-sm text-base-content/40">Usa el formulario para agregar el primero.</p>
				</div>
			) : filteredProducts.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-base-content/60">No se encontraron productos con "{searchTerm}"</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onEdit={onEditProduct}
							onDelete={onDeleteProduct}
						/>
					))}
				</div>
			)}
		</div>
	);
};

// Sub-componente Tarjeta de Producto para limpieza
const ProductCard: React.FC<{
	product: Product;
	onEdit: (p: Product) => void;
	onDelete: (id: string) => void
}> = ({ product, onEdit, onDelete }) => {

	// Función segura para obtener URL de imagen
	const getImageUrl = (img: any) => {
		if (!img) return null;
		return typeof img === "string" ? img : img.image;
	};

	return (
		<div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 border border-base-200 group">
			<div className="card-body p-5">
				<div className="flex justify-between items-start mb-2">
					<div>
						<div className="badge badge-sm badge-ghost mb-1 text-xs font-mono">{product.code}</div>
						<h3 className="card-title text-lg font-bold text-base-content leading-tight">{product.name}</h3>
						<p className="text-sm text-base-content/60 font-medium">{product.brand}</p>
					</div>
					<div className="text-right">
						<span className="block text-xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
						<span className={`text-xs px-2 py-0.5 rounded-full ${Number(product.quantity) > 10 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
							Stock: {product.quantity}
						</span>
					</div>
				</div>

				<div className="divider my-1"></div>

				{/* Galería Miniatura */}
				<div className="flex gap-2 overflow-x-auto pb-2 min-h-[60px]">
					{product.images && product.images.length > 0 ? (
						product.images.map((img, idx) => (
							<div key={idx} className="avatar">
								<div className="w-14 h-14 rounded-lg ring-1 ring-base-200">
									<img
										src={getImageUrl(img) || ""}
										alt={product.name}
										className="object-cover"
										onError={(e) => {
											e.currentTarget.src = "https://placehold.co/100?text=No+Img";
											e.currentTarget.parentElement?.classList.add('opacity-50');
										}}
									/>
								</div>
							</div>
						))
					) : (
						<div className="flex items-center gap-2 text-base-content/30 w-full bg-base-200/50 rounded-lg p-2">
							<ImageIcon className="w-8 h-8" />
							<span className="text-xs">Sin imágenes</span>
						</div>
					)}
				</div>

				{/* Acciones */}
				<div className="card-actions justify-end mt-4 pt-2 border-t border-base-100">
					<button
						onClick={() => onEdit(product)}
						className="btn btn-sm btn-ghost hover:text-warning hover:bg-warning/10 gap-2 transition-colors"
					>
						<Edit2 className="w-4 h-4" /> Editar
					</button>
					<button
						onClick={() => onDelete(String(product.id))}
						className="btn btn-sm btn-ghost hover:text-error hover:bg-error/10 gap-2 transition-colors"
					>
						<Trash2 className="w-4 h-4" /> Eliminar
					</button>
				</div>
			</div>
		</div>
	);
}

export default Items;