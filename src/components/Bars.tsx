import { Link } from "react-router";
import { Forklift, Layers, ReceiptText, Package } from "lucide-react";

function Bar() {
  const menuItems = [
    { to: "Logistics", label: "Logística", icon: <Forklift className="size-5" /> },
    { to: "Inventoryentry", label: "Entrada de Inventario", icon: <Layers className="size-5" /> },
    { to: "Pedidos", label: "Pedidos y Presupuestos", icon: <ReceiptText className="size-5" /> },
    { to: "Items", label: "Gestión de Artículos", icon: <Package className="size-5" /> },
  ];

  return (
    <nav className="p-4 w-full">
      {/* flex-col: Los botones se apilan (móvil)
          md:flex-row: Se alinean horizontalmente (tablet/PC)
      */}
      <div className="flex flex-col md:flex-row gap-4 w-full justify-stretch md:justify-center">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="btn btn-primary btn-outline md:btn-md btn-lg flex justify-center md:justify-center items-center gap-4 md:gap-2 shadow-sm"
          >
            {item.icon}
            <span className="font-bold md:font-semibold">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Bar;