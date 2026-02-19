import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // O react-router-dom
import { useAuthStore } from "../stores/useAuthStore";

const Auths: React.FC = () => {
  // Estado para alternar entre Login (true) y Registro (false)
  const [isLogin, setIsLogin] = useState(true);

  // Estados locales para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { signup, login, user, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Redirección si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (isLogin) {
      // Lógica de Inicio de Sesión
      const success = await login(email, password);
      if (success) navigate("/");
    } else {
      // Lógica de Registro
      if (password !== confirmPassword) {
        setLocalError("Las contraseñas no coinciden");
        return;
      }
      // Usamos el store que creaste (name -> first_name internamente)
      const success = await signup(email, password, name);
      if (success) {
        navigate("/");
      }
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 sm:p-6">

      {/* Contenedor Principal: Mobile First (100% ancho) a Desktop (max-w-md) */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden border border-base-300">

        {/* Pestañas de Navegación (DaisyUI Tabs) */}
        <div className="tabs tabs-boxed rounded-none bg-base-100 p-2">
          <button
            className={`tab flex-1 transition-all ${isLogin ? "tab-active !bg-primary !text-primary-content" : ""}`}
            onClick={() => { setIsLogin(true); setLocalError(null); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab flex-1 transition-all ${!isLogin ? "tab-active !bg-primary !text-primary-content" : ""}`}
            onClick={() => { setIsLogin(false); setLocalError(null); }}
          >
            Crear Cuenta
          </button>
        </div>

        <div className="card-body gap-4">
          <header className="text-center mb-2">
            <h2 className="text-3xl font-extrabold text-base-content">
              {isLogin ? "Bienvenido" : "Únete a nosotros"}
            </h2>
            <p className="text-sm text-base-content/60 mt-2">
              {isLogin ? "Ingresa tus credenciales para continuar" : "Completa tus datos para registrarte"}
            </p>
          </header>

          {/* Alertas de Error */}
          {displayError && (
            <div className="alert alert-error text-sm py-2 shadow-sm animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-control gap-3">

            {/* Campo Nombre (Solo en Registro) */}
            {!isLogin && (
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase">Nombre Completo</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  className="input input-bordered focus:input-primary w-full transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Campo Email */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase">Email</span>
              </label>
              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                className="input input-bordered focus:input-primary w-full transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase">Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered focus:input-primary w-full transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Campo Confirmar Contraseña (Solo en Registro) */}
            {!isLogin && (
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase">Confirmar Contraseña</span>
                </label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  className="input input-bordered focus:input-primary w-full transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end mt-1">
                <button type="button" className="link link-hover text-xs text-primary font-medium">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Botón de Acción Principal */}
            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 text-white ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {!isLoading && (isLogin ? "Iniciar Sesión" : "Crear mi Cuenta")}
            </button>
          </form>

          {/* Divisor Visual */}
          <div className="divider text-xs text-base-content/40 uppercase">O continuar con</div>

          {/* Botones Sociales (Ejemplo de diseño moderno) */}
          <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-outline btn-sm font-bold">Google</button>
            <button className="btn btn-outline btn-sm font-bold">GitHub</button>
          </div>
        </div>
      </div>

      {/* Footer del Formulario */}
      <p className="mt-8 text-sm text-base-content/60">
        ¿Necesitas ayuda? <span className="link link-primary">Contáctanos</span>
      </p>
    </div>
  );
};

export default Auths;