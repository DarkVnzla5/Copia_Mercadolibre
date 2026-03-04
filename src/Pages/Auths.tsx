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

  const { signup, login, user, error, isLoading, socialAuth } = useAuthStore();
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
  const handleSocialLogin = async (provider: string) => {
    setLocalError(null);
    try {
      const token = await getGoogleToken();
      const success = await socialAuth(provider, token);
      if (success) navigate("/");
    } catch (err) {
      setLocalError(`Error al conectar con ${provider}`);
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
          {/* Botones Sociales Integrados */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`btn btn-outline btn-sm font-bold ${isLoading ? "btn-disabled" : ""}`}
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C9.03,19.27 6.59,17.4 6.59,14C6.59,10.6 9.03,8.73 12.19,8.73C14.19,8.73 15.6,9.47 16.59,10.17L18.65,8.11C17.25,6.8 15.1,5.65 12.19,5.65C7.2,5.65 3.74,9.41 3.74,14C3.74,18.59 7.2,22.35 12.19,22.35C16.8,22.35 21.5,19.35 21.5,14C21.5,13 21.4,12.13 21.35,11.1Z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              className={`btn btn-outline btn-sm font-bold ${isLoading ? "btn-disabled" : ""}`}
              onClick={() => handleSocialLogin('github')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              GitHub
            </button>
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