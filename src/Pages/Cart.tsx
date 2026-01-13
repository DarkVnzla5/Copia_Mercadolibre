import React from "react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router";
import { useDolar } from "../hooks/useDolar";

const Cart: React.FC = () => {
    const { cart, isLoading, isError, removeItem, updateItem, clearCart, cartTotal, isActionsLoading } = useCart();
    const { dolarData } = useDolar();

    if (isLoading) return <div className="p-10 text-center">Cargando carrito...</div>;
    if (isError) return <div className="p-10 text-center text-error">Error al cargar el carrito.</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <Link to="/" className="btn btn-primary">
                    Ir a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 lg:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Carrito de Compras</h1>
                    <button
                        onClick={() => {
                            if (window.confirm("¿Vaciar carrito?")) clearCart();
                        }}
                        className="btn btn-error btn-outline btn-sm"
                        disabled={isActionsLoading}
                    >
                        Vaciar Carrito
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {cart.items.map((item) => (
                        <div key={item.id} className="card card-side bg-base-100 shadow-xl p-4 items-center">
                            {/* Note: Backend needs to provide product details (name, image) inside the item or populated.
                  Assuming item.product is just an ID basically, but ideally we need expanded data. 
                  For now if backend returns only IDs, we might need a way to fetch product info or backend should expand it.
                  Let's assume for now the cart item might NOT have full product info if not populated.
                  Since we don't have full product info in 'item' (based on interface), 
                  we might display ID or wait for backend fix. 
                  HOWEVER, let's look at useCart interface again. 
                  CartItem has 'product: string'. This is problematic for display.
                  We need to assume backend MIGHT send expanded data OR we need to fetch it.
                  Let's assume simple ID display for now or check if we can fix it.
              */}
                            <div className="card-body p-0 flex-row justify-between items-center w-full gap-4">
                                <div>
                                    <h3 className="font-bold">Producto ID: {item.product}</h3>
                                    <p className="text-sm opacity-70">Precio unitario al añadir: ${item.price_at_addition.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="btn btn-square btn-sm btn-ghost"
                                        disabled={isActionsLoading || item.cantidad <= 1}
                                        onClick={() => updateItem({ itemId: item.id, quantity: item.cantidad - 1 })}
                                    >
                                        -
                                    </button>
                                    <span className="font-bold w-4 text-center">{item.cantidad}</span>
                                    <button
                                        className="btn btn-square btn-sm btn-ghost"
                                        disabled={isActionsLoading}
                                        onClick={() => updateItem({ itemId: item.id, quantity: item.cantidad + 1 })}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-lg">${(item.price_at_addition * item.cantidad).toFixed(2)}</p>
                                </div>

                                <button
                                    className="btn btn-square btn-sm btn-error btn-outline"
                                    disabled={isActionsLoading}
                                    onClick={() => removeItem(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-base-100 shadow-xl mt-6 p-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total USD:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-secondary mt-2">
                        <span>Total BS (Aprox):</span>
                        <span>{dolarData ? `Bs. ${(cartTotal * Number(dolarData)).toFixed(2)}` : 'N/A'}</span>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="btn btn-primary btn-lg">Proceder al Pago</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
