import React from "react";
import { Link } from "react-router";

const HeroSection: React.FC = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://daisyui.com/images/stock/photo-1635805737707-575885c9e186.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
          alt="Ecommerce and Inventory Management"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Impulsa tu Negocio con Nuestra Plataforma Integral
          </h1>
          <p className="py-6">
            Gestiona tu inventario y vende en línea de manera sencilla. Diseñado
            para PyMEs, nuestra solución te permite controlar tus productos,
            procesar pedidos y llegar a más clientes, tanto en PC como en
            dispositivos móviles. ¡Comienza hoy y experimenta el crecimiento!
          </p>
          <Link to="/SignUp" className="btn btn-primary">
            ¡Comienza Gratis!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
