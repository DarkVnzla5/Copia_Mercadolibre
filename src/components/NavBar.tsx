import React from "react";
import { Link } from "react-router";
import { IoPersonCircleSharp } from "react-icons/io5";
import { GoArchive } from "react-icons/go";
import { PiSignInFill, PiUserPlusFill } from "react-icons/pi";
import { GestionIcon } from "./Icons";
import SearchBar from "./SearchBar";
import { useDolar } from "../hooks/useDolar";
import { BussinesName } from "../Constants/Constants";

const Header: React.FC = () => {
  const { dolarData } = useDolar();
  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log("Search query:", query);
  };
  const isLoggedIn = true;
  return (
    <nav className="flex flex-col gap-3 p-4 bg-base-100 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* --- Columna 1: Logo --- */}
        <div className="flex items-center">
          <Link to="/">
            <button className=" btn btn-lg btn-primary">{BussinesName}</button>
          </Link>
        </div>
        <section>
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* --- Columna 2: Indicador Dólar + Acciones de Usuario --- */}
        <div className="flex items-center justify-end gap-2">
          {/* Indicador del Dólar (más discreto, opcionalmente podrías ponerlo en la fila inferior) */}
          <span className=" btn btn-primary btn-md font-bold">
            {dolarData ? `${Number(dolarData).toFixed(2)} Bs.` : "Bs. N/A"}
          </span>

          {/* LÓGICA DE AUTENTICACIÓN: Dropdown o Botones */}
          {isLoggedIn ? (
            // Dropdown de Perfil (Usuario logueado)
            <div className="dropdown dropdown-end dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-primary btn-circle avatar btn-sm"
              >
                <div className="w-8 rounded-full">
                  <IoPersonCircleSharp className="size-full text-secondary" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm bg-base-100 dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
              >
                <li>
                  <Link to="/Profile">Perfil</Link>
                </li>
                <li>
                  <Link to="/signOut">Cerrar sesión</Link>
                </li>
              </ul>
            </div>
          ) : (
            // Botones de Iniciar Sesión / Crear Cuenta (Usuario NO logueado)
            <div className="flex items-center gap-1">
              <Link
                to="/LogIn"
                className="btn btn-primary btn-sm hidden lg:inline-flex"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/LogIn"
                className="btn btn-primary btn-square btn-sm lg:hidden"
                title="Iniciar Sesión"
              >
                <PiSignInFill className="size-5" />
              </Link>
              <Link
                to="/Signup"
                className="btn btn-secondary btn-sm hidden lg:inline-flex"
              >
                Crear Cuenta
              </Link>
              <Link
                to="/Signup"
                className="btn btn-secondary btn-square btn-sm lg:hidden"
                title="Crear Cuenta"
              >
                <PiUserPlusFill className="size-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- Horizontal Line Separator --- */}

      {/* ===================================== */}
      {/* ====== FILA INFERIOR: Navegación Principal ====== */}
      {/* ===================================== */}

      <div className="flex items-center justify-between gap-4 text-sm">
        {/* Gestión de Empresa */}
        <Link to="/Dashboard" className="btn btn-md max-lg:btn-sm">
          {/* **AQUÍ SE USA EL CLASSNAME CORREGIDO:** */}
          <GestionIcon className="size-5 max-lg:visible lg:hidden" />
          <span className=" max-lg:hidden lg:visible">Gestión de Empresa</span>
        </Link>
        <Link to="/Pedidos" className="btn btn-md  max-lg:btn-sm">
          Pedidos y Presupuestos
        </Link>

        {/* Gestión de Artículos */}
        <Link to="/Items" className="btn btn-md max-lg:btn-sm">
          <GoArchive className="size-5 max-lg:visible lg:hidden" />
          <span className="max-lg:hidden lg:visible">Gestión de Artículos</span>
        </Link>

        {/* Aquí puedes añadir más enlaces como Ofertas, Historial, etc. */}
      </div>
    </nav>
  );
};

export default Header;
