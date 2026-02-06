import React from "react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router";
import { useDolar } from "../hooks/useDolar";

interface ProductDetails {
	id: number;
	name: string;
	price: number;
	image: string | any[];
}
interface CartItem {
	id: number;
	cart: string;
	product: string | number;
	product_details?: ProductDetails;
	quantity: number;
	price_at_addition: number | string;
}

const Cart: React.FC = () => {
	const { cart, isLoading, isError, removeItem, updateItem, clearCart, cartTotal, isActionsLoading } = useCart();
	const { dolarData } = useDolar();

	if (isLoading) return (
		<div className="min-h-screen flex items-center justify-center">
			<span className="loading loading-spinner loading-lg text-primary"></span>
		</div>
	);

	if (isError) return (
		<div className="p-10 text-center text-error font-bold">
			Hubo un problema al cargar tu carrito. Intenta recargar la página.
		</div>
	);

	if (!cart || !cart.items || cart.items.length === 0) {
		return (
			<div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
				<div className="text-center space-y-4">
					<span className="text-6xl">🛒</span>
					<h2 className="text-3xl font-bold">Tu carrito está vacío</h2>
					<p className="text-gray-500">¿No sabes qué comprar? ¡Mira nuestros productos!</p>
					<Link to="/" className="btn btn-primary px-8">
						Ir a la Tienda
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 lg:p-10">
			<div className="max-w-5xl mx-auto">
				<div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-300">
					<div>
						<h1 className="text-4xl font-bold text-gray-800">Carrito de Compras</h1>
						<p className="text-sm text-gray-500 mt-1">{cart.items.length} productos agregados</p>
					</div>
					<button
						onClick={() => {
							if (window.confirm("¿Estás seguro de vaciar todo el carrito?")) clearCart();
						}}
						className="btn btn-ghost text-error btn-sm hover:bg-error/10"
						disabled={isActionsLoading}
					>
						🗑️ Vaciar Carrito
					</button>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* LISTA DE ITEMS */}
					<div className="lg:col-span-2 flex flex-col gap-4">
						{cart.items.map((item) => {
							// Lógica defensiva para obtener datos del producto
							const productName = item.product_details?.name || `Producto #${item.product}`;

							// Intentamos sacar la primera imagen si existe
							let productImage = "https://placehold.co/100?text=No+Img";
							if (item.product_details?.images && item.product_details.images.length > 0) {
								const firstImg = item.product_details.images[0];
								productImage = typeof firstImg === 'string' ? firstImg : firstImg.image;
							}

							const price = Number(item.price_at_addition);
							const totalLine = price * item.quantity;

							return (
								<div key={item.id} className="card card-side bg-base-100 shadow-sm border border-base-300 p-2 items-center transition-all hover:shadow-md">

									{/* IMAGEN DEL PRODUCTO */}
									<figure className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden m-2">
										<img src={productImage} alt={productName} className="w-full h-full object-cover" />
									</figure>

									<div className="card-body p-3 flex-row flex-wrap justify-between items-center w-full gap-4">

										{/* INFO NOMBRE Y PRECIO UNITARIO */}
										<div className="flex-1 min-w-[120px]">
											<h3 className="font-bold text-lg leading-tight">{productName}</h3>
											<p className="text-xs text-gray-500 mt-1">
												Unitario: <span className="font-mono">${price.toFixed(2)}</span>
											</p>
										</div>

										{/* CONTROLES DE CANTIDAD */}
										<div className="flex items-center border rounded-lg overflow-hidden border-gray-300">
											<button
												className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
												disabled={isActionsLoading || item.quantity <= 1}
												onClick={() => updateItem({ itemId: item.id, quantity: item.quantity - 1 })}
											>
												-
											</button>
											<span className="w-8 text-center font-bold text-sm bg-white">{item.quantity}</span>
											<button
												className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
												disabled={isActionsLoading}
												onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
											>
												+
											</button>
										</div>

										{/* SUBTOTAL Y BORRAR */}
										<div className="text-right flex flex-col items-end min-w-[80px]">
											<p className="font-extrabold text-lg text-primary">${totalLine.toFixed(2)}</p>
											<button
												className="btn btn-xs btn-link text-error no-underline p-0 mt-1"
												disabled={isActionsLoading}
												onClick={() => removeItem(item.id)}
											>
												Eliminar
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* RESUMEN DE PAGO (Sticky) */}
					<div className="lg:col-span-1">
						<div className="card bg-base-100 shadow-xl border border-primary/20 sticky top-4">
							<div className="card-body p-6">
								<h2 className="card-title text-xl mb-4">Resumen del Pedido</h2>

								<div className="flex justify-between items-center text-sm text-gray-600 mb-2">
									<span>Subtotal</span>
									<span>${cartTotal.toFixed(2)}</span>
								</div>
								<div className="divider my-2"></div>

								<div className="flex justify-between items-center text-2xl font-black text-primary">
									<span>Total</span>
									<span>${cartTotal.toFixed(2)}</span>
								</div>

								{dolarData && (
									<div className="alert alert-info py-2 mt-4 text-xs flex justify-between">
										<span>Tasa BCV: {dolarData}</span>
										<span className="font-bold">Bs. {(cartTotal * Number(dolarData)).toFixed(2)}</span>
									</div>
								)}

								<div className="mt-6">
									<button className="btn btn-primary w-full btn-lg shadow-lg hover:scale-[1.02] transition-transform">
										Proceder al Pago
									</button>
									<Link to="/" className="btn btn-ghost w-full mt-2 btn-sm">
										Seguir comprando
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;