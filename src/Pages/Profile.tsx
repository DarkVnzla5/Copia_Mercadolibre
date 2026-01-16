import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, isLoading, error } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        address: "",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUser(profile);
    if (success) {
      setEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-error">No has iniciado sesión</h1>
            <button className="btn btn-primary mt-4" onClick={() => navigate("/LogIn")}>Ir a Iniciar Sesión</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-base-100 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-primary">Mi Perfil</h2>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nombre</span>
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            value={profile.name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Correo Electrónico</span>
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            value={profile.email}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Teléfono</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="input input-bordered w-full"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Dirección</span>
          </label>
          <input
            type="text"
            name="address"
            className="input input-bordered w-full"
            value={profile.address}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div className="flex gap-4 mt-8">
          {editing ? (
            <>
              <button type="submit" className="btn btn-primary flex-1" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner"></span> : "Guardar Cambios"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleEdit}
              >
                Editar Perfil
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;

