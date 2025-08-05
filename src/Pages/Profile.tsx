import React, { useState } from "react";
import { useNavigate } from "react-router";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    // Optionally reset to initialProfile or fetch from API
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here (API call)
    setEditing(false);
    // Optionally show a success message
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Name</span>
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
        <div>
          <label className="label">
            <span className="label-text">Email</span>
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
        <div>
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="input input-bordered w-full"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            type="text"
            name="address"
            className="input input-bordered w-full"
            value={profile.address}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="flex gap-2 mt-4">
          {editing ? (
            <>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
