import React from "react";
import { Link } from "react-router";

const LoginPage: React.FC = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left text-primary">
          <p className="text-5xl font-bold">Iniciar Sesión</p>
          <p className="p-2">
            Ingresa tu e-mail o telefono para iniciar sesion
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
            <div className="form-control">
              <label htmlFor="email">
                <p>E-mail o telefono</p>
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered py-4"
                required
              />
              <label className="label">
                <Link to="#" className="btn-primary btn p-4">
                  ¿Olvidaste tu contraseña?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Iniciar Sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
