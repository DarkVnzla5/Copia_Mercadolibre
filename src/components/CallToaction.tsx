import React from "react";
import { Link } from "react-router";

const CallToActionSection: React.FC = () => {
  return (
    <div className="hero py-20 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Transformar tu Negocio?
          </h2>
          <p className="mb-6">
            Únete a cientos de PyMEs que ya están gestionando su ecommerce e
            inventario de forma eficiente con nuestra plataforma.
          </p>
          <Link to="/Signup" className="btn btn-primary btn-lg">
            ¡Empieza tu Prueba Gratuita!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;
