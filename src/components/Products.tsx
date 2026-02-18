import { useMemo } from "react";
import { Link } from "react-router";
import type { Product } from "../hooks/useProducts";
import { useProducts } from "../hooks/useProducts";
import { useDolar } from "../hooks/useDolar";
import { useFilterStore } from "../stores/useFilterStore";


const useFilteredProducts = (allProducts: Product[]) => {
	const { minPrice, maxPrice, selectedCategory, searchQuery } = useFilterStore();


	const filteredProducts = useMemo(() => {
		return allProducts.filter((product) => {
			const productPrice = Number(product.price) || 0;
			const productName = (product.name || product.title || "").toLowerCase();
			const query = searchQuery.toLowerCase();
			//Filtro por búsqueda
			const matchSearch = productName.includes(query);
			//Filtro por categoría
			const categoryMatch =
				selectedCategory === "Todo" || product.category === selectedCategory;
			//Filtro por precio
			const min = minPrice ?? 0;
			const max = maxPrice ?? 0;
			const minPriceMatch =
				minPrice === null || minPrice <= 0 || productPrice >= min;
			const maxPriceMatch =
				maxPrice === null || maxPrice <= 0 || productPrice <= max;
			return categoryMatch && minPriceMatch && maxPriceMatch && matchSearch;
		});
	}, [allProducts, minPrice, maxPrice, selectedCategory, searchQuery]);
	return filteredProducts;
};

const Products = () => {
	const { dolarData } = useDolar();
	const { products: allProducts, isLoading, isError } = useProducts();
	const filteredProducts = useFilteredProducts(allProducts);
	const { searchQuery } = useFilterStore();
	//Novedades
	const newArrivals = useMemo(() => {
		const ONE_WEEK_AGO = new Date();
		ONE_WEEK_AGO.setDate(ONE_WEEK_AGO.getDate() - 7);

		return allProducts.filter((p =>
			p.created_at ? new Date(p.created_at) >= ONE_WEEK_AGO : false
		)).slice(0, 4); // Mostramos máximo 4 en el banner superior
	}, [allProducts]);

	if (isLoading) return <div className="p-4 text-center">Cargando productos...</div>;
	if (isError) return <div className="p-4 text-center text-red-500">Error al cargar productos</div>;


	return (
		<section className="flex-grow p-4">
			{newArrivals.length > 0 && searchQuery === "" && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						✨ Recién Llegados <div className="badge badge-secondary">Nuevo</div>
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{newArrivals.map(product => (
							<Link key={`new-${product.id}`} to={`/products/${product.id}`} className="card bg-secondary text-secondary-content shadow-sm hover:scale-95 transition-transform">
								<div className="card-body p-3">
									<p className="text-xs font-bold truncate">{product.name}</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			)
			}
			{/* SECCIÓN DE PRODUCTOS */}
			{filteredProducts.length === 0 ? (
				<div className="alert alert-warning shadow-lg max-w-lg mx-auto ">
					<div>
						<p className="font-bold">Sin Resultados</p>
					</div>
				</div>
			) : (
				<ul className="grid max-lg:grid-cols-1 max-xl:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
					{filteredProducts.map((product) => (
						<Link
							key={product.id}
							to={`/products/${product.id}`}
							className="group block"
						>
							<li
								// === Tarjeta de Producto ===
								// Añadimos 'h-full' para asegurar que todas las tarjetas tengan la misma altura
								// dentro de la fila de la cuadrícula.
								className="card card-compact bg-base-100 shadow-xl overflow-hidden h-full 
                         transition-all duration-300 transform 
                         hover:shadow-2xl hover:scale-[1.02]"
							>
								{/* FIGURA: Contenedor de la imagen
                  La clave es 'aspect-square' y 'w-full' para forzar una proporción 1:1,
                  independientemente de las dimensiones originales de la imagen.
              */}
								<figure className="relative w-full aspect-square overflow-hidden">
									<img
										src={product.thumbnail ||
											(typeof product.images[0] === "string"
												? product.images[0]
												: product.images[0]?.image) || undefined}
										alt={product.title || product.name}
										// w-full h-full object-cover: Asegura que la imagen llene el espacio cuadrado
										// sin distorsionarse (la imagen se recorta si es necesario).
										className="w-3/4 h-3/4 object-cover 
                             transition duration-500 ease-in-out 
                             group-hover:opacity-90 group-hover:scale-105"
									/>
								</figure>

								{/* CUERPO DE LA TARJETA */}
								<div className="card-body p-4">
									{/* Título: Usa 'line-clamp-2' para limitar a 2 líneas y evitar que tarjetas 
                    con títulos largos sean más altas que otras. */}
									<p className="card-title text-secondary  line-clamp-2 min-h-10">
										{product.title || product.name}
									</p>

									{/* Precio: Destacado */}
									<div className="text-xl font-bold text-secondary mt-2">
										<p>{Number(product.price || 0).toFixed(2)} $</p>
										<p>
											{dolarData
												? `${(Number(product.price || 0) * Number(dolarData)).toFixed(
													2
												)} Bs.`
												: "Bs. N/A"}
										</p>
									</div>
								</div>
							</li>
						</Link>
					))}
				</ul>
			)
			}
		</section>
	);
};

export default Products;
