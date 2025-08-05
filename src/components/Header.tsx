import React, { useState, useEffect } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router";

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
    <nav className="flex flex-wrap justify-evenly w-full bg-base-300 items-center gap-4 py-5">
      {/* Left Section: Logo and Name */}
      <section className="flex items-center justify-between gap-2">
        <Link to="/">
          <img
            src="\Logo.jpg"
            alt="Vuelvan Caras Logo"
            className="h-20 w-24 mr-28 aspect-video shadow-lg"
          />
        </Link>

        <span className="font-bold text-primary p-4 rounded-lg shadow-lg hover:bg-base-content transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer">
          Comercial Vuelvan Caras, C.A.
        </span>
      </section>

      {/* Center Section: Dólar Promedio */}
      <section className="flex justify-center items-center gap-2 ">
        <div className="text-primary font-bold">
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
              <span className="text-red-500">Cargando...</span>
            )}
          </span>
        </div>
      </section>

      {/* Center Section: Management of items*/}
      <section>
        <Link to="/Items" className="btn btn-ghost btn-circle">
          Gestion de Productos
        </Link>
      </section>

      {/* Profiles*/}
      <section className="flex">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
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
              <Link to="/configuration">Configuración</Link>
            </li>
            <li>
              <Link to="/Profile">Perfil</Link>
            </li>
            <li>
              <Link to="/signOut">Cerrar sesión</Link>
            </li>
          </ul>
        </div>
      </section>
    </nav>
  );
}
export default Header;
