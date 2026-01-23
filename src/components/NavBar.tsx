import React from "react";
import { Link } from "react-router";
import { IoPersonCircleSharp } from "react-icons/io5";

import { PiSignInFill, PiUserPlusFill, PiShoppingCartFill } from "react-icons/pi";
import { GestionIcon } from "./Icons";
import SearchBar from "./SearchBar";
import { useDolar } from "../hooks/useDolar";
import { BussinesName } from "../Constants/Constants";
import DeliveryModal from "./Buttons";
import { useAuthStore } from "../stores/useAuthStore";


const Header: React.FC = () => {
  const { dolarData } = useDolar();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log("Search query:", query);
  };

  const isLoggedIn = !!user?.id;

  return (
    <nav className="flex flex-col gap-3 p-4 bg-base-200 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* --- Columna 1: Logo --- */}
        <section>
          <div className="flex items-center">
            <Link to="/">
              <button className=" btn btn-lg btn-primary">
                {BussinesName}
              </button>
            </Link>
          </div>
        </section>
        <section>
          <DeliveryModal />
        </section>
        <section>
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* --- Columna 2: Indicador Dólar + Acciones de Usuario --- */}
        <div className="flex items-center justify-end gap-2">
          {/* Indicador del Dólar (más discreto, opcionalmente podrías ponerlo en la fila inferior) */}
          <span className=" btn btn-primary btn-md font-bold">
            {dolarData ? `${Number(dolarData).toFixed(2)} Bs.` : "Bs. N/A"}
          </span>

          {/* LÓGICA DE AUTENTICACIÓN: Modal de Perfil o Botones de Login */}
          {isLoggedIn ? (
            <>
              {/* Botón de Perfil que abre el Modal */}
              <button
                className="btn btn-primary btn-circle avatar btn-sm"
                onClick={() => setIsProfileOpen(true)}
              >
                <div className="w-8 rounded-full">
                  <IoPersonCircleSharp className="size-full text-secondary" />
                </div>
              </button>

              {/* Modal de Perfil (como el de Delivery) */}
              <dialog className={`modal ${isProfileOpen ? "modal-open" : ""}`}>
                <div className="modal-box max-w-sm">
                  <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    ✕
                  </button>

                  <h3 className="font-bold text-xl text-primary mb-6">
                    Mi Cuenta
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="bg-base-200 p-4 rounded-xl flex items-center gap-3 mb-4">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <IoPersonCircleSharp className="size-full text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-base-content">{user?.name || "Usuario"}</p>
                        <p className="text-xs text-base-content/60">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/Profile"
                      className="btn btn-ghost justify-start gap-4"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <IoPersonCircleSharp className="size-5" />
                      Perfil
                    </Link>

                    <button
                      className="btn btn-error btn-outline justify-start gap-4 mt-2"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                    >
                      <PiSignInFill className="size-5 rotate-180" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button onClick={() => setIsProfileOpen(false)}>close</button>
                </form>
              </dialog>
            </>
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
                to="/SignUp"
                className="btn btn-secondary btn-sm hidden lg:inline-flex"
              >
                Crear Cuenta
              </Link>
              <Link
                to="/SignUp"
                className="btn btn-secondary btn-square btn-sm lg:hidden"
                title="Crear Cuenta"
              >
                <PiUserPlusFill className="size-5" />
              </Link>
            </div>
          )}
          <Link to="/cart" className="btn btn-ghost btn-circle">
            <PiShoppingCartFill className="size-6" />
          </Link>
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


        {/* Aquí puedes añadir más enlaces como Ofertas, Historial, etc. */}
      </div>
    </nav>
  );
};

export default Header;
