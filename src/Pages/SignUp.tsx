import React from "react";
import { useAuthStore } from "../stores/useAuthStore";
const SignUpPage: React.FC = () => {
  function SignUpForm() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const signUp = useAuthStore((state) => state.signUp);
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await signUp(email, password, name);
      if (success) {
        alert("Cuenta creada exitosamente");
        setEmail("");
        setPassword("");
        setName("");
      }
    };
    if (user) {
      return <div>Ya has iniciado sesión</div>;
    }
    return (
      <form onSubmit={handleSubmit} className="hero min-h-screen bg-base-200">
        {error && (
          <div className="alert alert-error shadow-lg">
            <div>{error}</div>
          </div>
        )}
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-primary">
            <p className="text-5xl font-bold">Crea tu Cuenta</p>
            <p className="py-6">
              Completa el formulario para registrarte y comenzar a disfrutar de
              nuestros servicios.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre Completo"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Correo</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contraseña</span>
                </label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="input input-bordered"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Confirmar Contraseña</span>
                </label>
                <input
                  type="password"
                  placeholder="confirma tu contraseña"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Crear Cuenta</button>
              </div>
            </form>
          </div>
        </div>
      </form>
    );
  }

  return <SignUpForm />;
};

export default SignUpPage;
