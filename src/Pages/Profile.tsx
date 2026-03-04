import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: File | string;
}

function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser, isLoading, error, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !editing) {
      setProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, editing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, avatar: file }));
      // Aquí puedes subir el archivo al servidor
      console.log("Archivo seleccionado:", file);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(true);
  }

  const handleCancel = () => {
    setEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (user) {
      setProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        avatar: user.avatar || "",
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
            <button className="btn btn-primary mt-4" onClick={() => navigate("/Auths")}>Ir a Iniciar Sesión</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-base-100 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-3xl font-bold mb-6 text-primary">Mi Perfil</p>
        </div>
        <div>
          {profile.avatar && (
            <img
              src={typeof profile.avatar === "string" ? profile.avatar : URL.createObjectURL(profile.avatar)}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
          )}
        </div>
      </div>
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
            name="first_name"
            className="input input-bordered w-full"
            value={profile.first_name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Apellido</span>
          </label>
          <input
            type="text"
            name="last_name"
            className="input input-bordered w-full"
            value={profile.last_name}
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
            <span className="label-text font-semibold">Foto de Perfil</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            accept="image/*"
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
                className="btn btn-outline flex-1"
                onClick={handleEdit}
              >
                Editar Perfil
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </>
          )}
        </div>
        <div>
          <button
            className="btn btn-outlines btn-md"
            onClick={() => { logout(); }}>
            Cerrar sesion
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

