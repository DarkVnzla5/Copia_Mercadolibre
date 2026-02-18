import { Link } from "react-router";
import { GoArchive } from "react-icons/go";
import { Forklift, CirclePile, ReceiptText } from "lucide-react";

function Bar() {
	return (
		<section className="flex gap-4 justify-between p-4 mb-4">
			<div>
				<button className="btn btn-primary">
					<Link to="Logistics">
						<Forklift className="size-5 max-lg:visible lg:hidden" />
						<span className="max-lg:hidden lg:visible">Logistica</span>
					</Link>
				</button>
			</div>
			<div>
				<button className="btn btn-primary">
					<Link to="Inventoryentry">
						<CirclePile className="size-5 max-lg:visible lg:hidden" />
						<span className="max-lg:hidden lg:visible">Inventario</span>
					</Link>
				</button>
			</div>
			<button className="btn btn-primary">
				<Link to="Pedidos">
					<ReceiptText className="size-5 max-lg:visible lg:hidden" />
					<span className="max-lg:hidden lg:visible">Pedidos y Presupuestos</span>
				</Link>
			</button>
			<button className="btn btn-primary">
				<Link to="Items">
					<GoArchive className="size-5 max-lg:visible lg:hidden" />
					<span className="max-lg:hidden lg:visible">Gestión de Artículos</span>
				</Link>
			</button>
		</section>
	);
}

export default Bar;
