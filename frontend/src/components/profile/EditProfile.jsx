import { useEffect, useState } from "react";
import { getFarmerProfile, updateFarmerProfile } from "./api";

export default function EditProfileForm() {
  const [form, setForm] = useState({
    fullName: "",
    alternateMobile: "",
    villageOrCity: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getFarmerProfile();

        setForm({
          fullName: data.fullName || "",
          alternateMobile: data.alternateMobile || "",
          villageOrCity: data.villageOrCity || "",
          district: data.district || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      } catch (err) {
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateFarmerProfile(form);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-4 space-y-4">

      {/* Full Name */}
      <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />

      {/* Alternate Mobile */}
      <InputField label="Alternate Mobile" name="alternateMobile" value={form.alternateMobile} onChange={handleChange} />

      {/* City */}
      <InputField label="Village / City" name="villageOrCity" value={form.villageOrCity} onChange={handleChange} />

      {/* District */}
      <InputField label="District" name="district" value={form.district} onChange={handleChange} />

      {/* State */}
      <InputField label="State" name="state" value={form.state} onChange={handleChange} />

      {/* Pincode */}
      <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {/* Message */}
      {message && (
        <p className="text-sm text-center text-gray-600">{message}</p>
      )}
    </form>
  );
}


// Reusable Input
function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full"
      />
    </div>
  );
}