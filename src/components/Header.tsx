import React, { useState, useEffect } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router";
import { GoArchive } from "react-icons/go";

function Header() {
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
    <nav className="navbar bg-base-100 justify-between p-4">
      {/* Left Section: Logo and Name */}
      <section className="navbar-start">
        <Link to="/">
          <img
            src="\Logo.jpg"
            alt="Vuelvan Caras Logo"
            className="h-20 w-24 mr-28 aspect-video shadow-lg"
          />
        </Link>
        <span className="font-bold max-lg:hidden text-primary p-2 rounded-lg hover:bg-primary hover:text-primary-content shadow-lg cursor-pointer">
          Comercial Vuelvan Caras, C.A.
        </span>
      </section>

      {/* Center Section: Dólar Promedio */}
      <section className="navbar-center gap-2">
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
      <section className="navbar-center gap-2 ">
        <Link
          to="/Items"
          className="font-bold max-lg:hidden text-primary p-2 rounded-lg hover:bg-primary hover:text-primary-content shadow-lg cursor-pointer"
        >
          Gestion de Productos
        </Link>
        <Link
          to="/Items"
          className="lg:visible text-primary p-2 items-center justify-center flex  rounded hover:bg-primary hover:text-primary-content shadow-lg cursor-pointer"
        >
          <GoArchive />
        </Link>
      </section>

      {/* Profiles*/}
      <section className="navbar-end">
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
      <section className="navbar-end">
        <div>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Crear Cuenta
          </Link>
        </div>
      </section>
    </nav>
  );
}
export default Header;
