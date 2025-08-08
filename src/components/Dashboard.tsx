import React from "react";
const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Resumen del Dashboard</h1>
      {/* Aquí puedes agregar componentes como tarjetas, gráficos, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Ventas Totales</h2>
            <p className="text-4xl font-bold">$125,000</p>
          </div>
        </div>
        {/* Más tarjetas y gráficos... */}
      </div>
    </div>
  );
};

export default Dashboard;
