import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

export default function SchemeControl() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [regionInput, setRegionInput] = useState("");
  // ================= FETCH =================
  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/schemes");
      setSchemes(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scheme?",
    );
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/admin/schemes/${id}`);
      fetchSchemes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete scheme");
    }
  };

  const openEdit = (scheme) => {
    setSelectedScheme(scheme);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      await axiosClient.put(
        `/admin/schemes/${selectedScheme._id}`,
        selectedScheme,
      );

      setEditMode(false);
      setSelectedScheme(null);
      fetchSchemes();

      alert("Scheme updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update scheme");
    } finally {
      setUpdating(false);
    }
  };

  const toggleField = async (id, field, value) => {
    try {
      // optimistic UI update
      setSchemes((prev) =>
        prev.map((s) => (s._id === id ? { ...s, [field]: value } : s)),
      );

      await axiosClient.put(`/admin/schemes/${id}`, {
        [field]: value,
      });
    } catch (err) {
      console.error(err);
      alert("Update failed");
      fetchSchemes(); // rollback
    }
  };
  const [form, setForm] = useState({
    title: "",
    shortTitle: "",
    description: "",
    category: "Subsidy",
    department: "",
    applicationLink: "",
    isActive: true,
    verified: false,
    region: [],
  });

  const [creating, setCreating] = useState(false);

  // ================= CREATE SCHEME =================
  const handleCreate = async () => {
    if (!form.title || !form.description) {
      alert("Title and Description are required");
      return;
    }

    try {
      setCreating(true);

      await axiosClient.post("/admin/schemes", form);

      setForm({
        title: "",
        shortTitle: "",
        description: "",
        category: "Subsidy",
        department: "",
        applicationLink: "",
        isActive: true,
        verified: false,
        region: [],
      });

      fetchSchemes();
      alert("Scheme created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create scheme");
    } finally {
      setCreating(false);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Government Schemes</h2>

        <button onClick={fetchSchemes} className="btn btn-outline btn-sm">
          Refresh
        </button>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 w-full rounded-lg"></div>
          ))}
        </div>
      )}
      <div className="card bg-base-200 p-5 space-y-3 shadow">
        <h3 className="text-xl font-bold">Create New Scheme</h3>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered w-full"
        />

        <input
          name="shortTitle"
          value={form.shortTitle}
          onChange={handleChange}
          placeholder="Short Title"
          className="input input-bordered w-full"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option>Subsidy</option>
            <option>Loan</option>
            <option>Insurance</option>
            <option>Training</option>
            <option>Grant</option>
            <option>Other</option>
          </select>

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="input input-bordered w-full"
          />
        </div>
        <input
          value={regionInput}
          onChange={(e) => setRegionInput(e.target.value)}
          placeholder="Add region (e.g. Punjab, UP, Maharashtra)"
          className="input input-bordered w-full"
        />

        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            if (!regionInput.trim()) return;

            setForm((prev) => ({
              ...prev,
              region: [...(prev.region || []), regionInput.trim()],
            }));

            setRegionInput("");
          }}
        >
          Add Region
        </button>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.region?.map((r, idx) => (
            <span key={idx} className="badge badge-outline gap-2">
              {r}
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    region: prev.region.filter((_, i) => i !== idx),
                  }))
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <input
          name="applicationLink"
          value={form.applicationLink}
          onChange={handleChange}
          placeholder="Application Link"
          className="input input-bordered w-full"
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="verified"
              checked={form.verified}
              onChange={handleChange}
            />
            Verified
          </label>
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="btn btn-primary w-full"
        >
          {creating ? "Creating..." : "Create Scheme"}
        </button>
      </div>
      {/* ================= EMPTY STATE ================= */}
      {!loading && schemes.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium">No Schemes Found</p>
          <p className="text-sm">Add new government schemes to display here.</p>
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="grid gap-5 md:grid-cols-2">
        {schemes.map((s) => (
          <div
            key={s._id}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-all border"
          >
            <div className="card-body space-y-3">
              {/* TITLE */}
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                {s.shortTitle && (
                  <p className="text-sm text-gray-500">{s.shortTitle}</p>
                )}
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-outline">{s.category}</span>

                {s.department && (
                  <span className="badge badge-ghost">{s.department}</span>
                )}

                <span
                  className={`badge ${
                    s.isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </span>

                {s.verified && (
                  <span className="badge badge-info">Verified</span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {s.description}
              </p>

              {/* EXTRA INFO */}
              <div className="text-xs text-gray-500 space-y-1">
                {s.region?.length > 0 && (
                  <p>
                    <strong>Region:</strong> {s.region.join(", ")}
                  </p>
                )}

                {s.language && (
                  <p>
                    <strong>Language:</strong> {s.language}
                  </p>
                )}
              </div>

              {/* LINK */}
              {s.applicationLink && (
                <a
                  href={s.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Apply Official Link →
                </a>
              )}

              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    className={`btn btn-xs ${
                      s.isActive ? "btn-success" : "btn-outline"
                    }`}
                    onClick={() => toggleField(s._id, "isActive", !s.isActive)}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </button>

                  <button
                    className={`btn btn-xs ${
                      s.verified ? "btn-info" : "btn-outline"
                    }`}
                    onClick={() => toggleField(s._id, "verified", !s.verified)}
                  >
                    {s.verified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {editMode && selectedScheme && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setEditMode(false)}
          >
            <div
              className="bg-base-100 p-6 rounded-lg w-[500px] space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold">Edit Scheme</h3>

              <input
                className="input input-bordered w-full"
                value={selectedScheme.title}
                onChange={(e) =>
                  setSelectedScheme({
                    ...selectedScheme,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className="textarea textarea-bordered w-full"
                value={selectedScheme.description}
                onChange={(e) =>
                  setSelectedScheme({
                    ...selectedScheme,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="input input-bordered w-full"
                value={selectedScheme.department || ""}
                onChange={(e) =>
                  setSelectedScheme({
                    ...selectedScheme,
                    department: e.target.value,
                  })
                }
              />

              {/* REGION FIX */}
              <input
                className="input input-bordered w-full"
                value={selectedScheme.region?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedScheme({
                    ...selectedScheme,
                    region: e.target.value.split(",").map((r) => r.trim()),
                  })
                }
                placeholder="Regions (comma separated)"
              />

              <div className="flex gap-2 justify-end">
                <button
                  className="btn btn-outline"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
