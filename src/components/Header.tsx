import React, { useState, useEffect } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router";
import { GoArchive } from "react-icons/go";
import { PiSignInFill } from "react-icons/pi";

const Header: React.FC = () => {
  const [dolarPromedio, setDolarPromedio] = useState(null);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch(
          "https://ve.dolarapi.com/v1/dolares/oficial"
        );
        const data = await response.json();
        setDolarPromedio(data.promedio);
      } catch (error) {
        console.error("Error al obtener el valor del dólar:", error);
      }
    };
    fetchDolar();
  }, []);

  return (
    <nav className="navbar bg-base-100 overflow-hidden justify-around p-4 gap-2">
      <section className="navbar navbar-top"></section>
      <section className="navbar navbar-bottom"></section>
      {/* Left Section: Logo and Name */}
      <section className="navbar">
        <Link to="/">
          <img
            src="\Logo.jpg"
            alt="Vuelvan Caras Logo"
            className="h-20 w-24 mr-28 aspect-video shadow-lg"
          />
        </Link>
        <Link to="Dashboard">
          <button className="inline-flex bg-primary-content text-primary font-bold text-lg rounded-lg p-2 shadow-lg">
            <p className="inline-flex">Comercial Vuelvan Caras, C.A.</p>
          </button>
        </Link>
      </section>

      {/* Center Section: Dólar Promedio */}
      <section className="navbar-center gap-4">
        <div className="btn-primary btn">
          <span>
            Dólar BCV:{" "}
            {dolarPromedio ? (
              <span>
                {new Intl.NumberFormat("es-VE", {
                  style: "currency",
                  currency: "USD",
                }).format(dolarPromedio)}
              </span>
            ) : (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </span>
        </div>
      </section>

      {/* Center Section: Management of items*/}
      <section className="navbar gap-4">
        <Link to="/Items">
          <button className="btn btn-primary max-lg:visible lg:hidden">
            <GoArchive className="inline mr-2" />
          </button>
          <button className="btn btn-primary max-lg:hidden lg:visible">
            Gestión de artículos
          </button>
        </Link>
      </section>
      <section className="navbar">
        <div>
          <input
            type="checkbox"
            className="toggle toggle-primary bg-secondary theme-controller "
            value="emerald"
          />
        </div>
      </section>

      {/* Profiles*/}
      <section className="navbar">
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
      </section>
      {/*Sesions */}
      <section className="navbar-end gap-2">
        <div>
          <Link
            to="/LoginUp"
            className="btn btn-primary lg:hidden max-lg:visible"
          >
            <PiSignInFill />
          </Link>
        </div>
        <div>
          <Link
            to="/LoginUp"
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
      </section>
    </nav>
  );
};
export default Header;
