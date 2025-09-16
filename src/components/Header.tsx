import React from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router";
import { GoArchive } from "react-icons/go";
import { PiSignInFill } from "react-icons/pi";
import { GestionIcon } from "./Icons";
import { useDolar } from "../hooks/useDolar";

const Header: React.FC = () => {
  const { dolarData, loading, error } = useDolar();
  return (
    <nav
      className="navbar bg-base-100 shadow-lg flex-col items-center
     px-4 sm-px-8 py-2 "
    >
      <section className="flex w-full justify-around gap-2 mb-2 flex-wrap">
        <div className=" flex items-center">
          <Link to="/">
            <img
              src="\Logo.jpg"
              alt="Vuelvan Caras Logo"
              className="h-20 w-30  aspect-video shadow-lg max-lg:visible lg:hidden"
            />
          </Link>
          <Link to="/">
            <button className="max-lg:hidden lg:visible inline-flex bg-primary-content text-primary font-bold text-lg rounded-lg p-2 shadow-lg">
              Comercial Vuelvan Caras, C.A.
            </button>
          </Link>
        </div>
        <div className="flex items-center">
          <Link to="Dashboard">
            <button className="btn btn-primary shadow-lg lg:visible max-lg:hidden">
              Gestion de Empresa
            </button>
          </Link>
          <Link to="Dashboard">
            <button className="btn btn-primary text-secondary shadow-lg lg:hidden max-lg:visible">
              <GestionIcon />
            </button>
          </Link>
        </div>
        <div>
          <div>
            <button className="btn-primary btn">
              {loading
                ? "Cargando Dolar..."
                : error
                ? "Error al cargar Dolar"
                : dolarData?.promedio
                ? `Dolar Hoy: $${dolarData.promedio.toFixed(2)}`
                : "Dolar no disponible"}
            </button>
          </div>
        </div>
      </section>
      <section className="navbar navbar-bottom">
        <div className=" gap-4">
          <Link to="/Items">
            <button className="btn btn-primary max-lg:visible lg:hidden">
              <GoArchive className="inline mr-2" />
            </button>
            <button className="btn btn-primary max-lg:hidden lg:visible">
              Gestión de artículos
            </button>
          </Link>
        </div>
        <div>
          <div>
            <input
              type="checkbox"
              className="toggle toggle-primary bg-secondary theme-controller "
              value="emerald"
            />
          </div>
        </div>
        <div>
          <div className="dropdown dropdown-end dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <IoPersonCircleSharp className="size-full " />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm text-primary bg-primary-content dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li className="justify-between">
                <Link to="/Profile">Perfil</Link>
              </li>

              <li>
                <Link to="/signOut">Cerrar sesión</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-end gap-2">
          <div>
            <Link
              to="/LogIn"
              className="btn btn-primary lg:hidden max-lg:visible"
            >
              <PiSignInFill />
            </Link>
          </div>
          <div>
            <Link
              to="/LogIn"
              className="btn btn-primary lg:visible max-lg:hidden"
            >
              Iniciar Sesión
            </Link>
          </div>
          <div>
            <Link
              to="/Signup"
              className="btn btn-primary lg:visible max-lg:hidden"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>
    </nav>
  );
};
export default Header;
