import { Link } from "react-router";
import { GoArchive } from "react-icons/go";
import { Forklift, CirclePile, ReceiptText } from "lucide-react";

function Bar() {
	return (
		<section className="flex gap-4 mb-4">
			<div>
				<button className="btn">
					<Link to="Logistics">
						<Forklift className="size-5 max-lg:visible lg:hidden" />
						<span className="max-lg:hidden lg:visible">Logistica</span>
					</Link>
				</button>
			</div>
			<div>
				<button className="btn">
					<Link to="Inventoryentry">
						<CirclePile className="size-5 max-lg:visible lg:hidden" />
						<span className="max-lg:hidden lg:visible">Inventario</span>
					</Link>
				</button>
			</div>
			<Link to="/Pedidos" className="btn btn-md  max-lg:btn-sm">
				Pedidos y Presupuestos
			</Link>

			{/* Gestión de Artículos */}
			<Link to="/Items" className="btn btn-md max-lg:btn-sm">
				<GoArchive className="size-5 max-lg:visible lg:hidden" />
				<span className="max-lg:hidden lg:visible">Gestión de Artículos</span>
			</Link>
		</section>
	);
}

export default Bar;
