import { useEffect, useState } from "react";
import {
  getAdmins,
  removeAdmin,
  makeAdmin
} from "../services/superAdminService";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAdmins();
      setAdmins(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Remove Admin
  const handleRemove = async (id) => {
    const confirm = window.confirm("Remove this admin?");
    if (!confirm) return;

    await removeAdmin(id);
    fetchAdmins();
  };

  //  Make Admin (via email)
  const handleMakeAdmin = async () => {
    if (!email) return alert("Enter email");

    try {
      await makeAdmin(email); // backend should accept email
      setEmail("");
      fetchAdmins();
    } catch (err) {
      alert("Failed to make admin");
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-bold">Manage Admins</h2>

      {/* ➕ Add Admin */}
      <div className="card p-4 shadow space-y-3">
        <h3 className="font-semibold">Make Admin</h3>

        <input
          type="email"
          placeholder="Enter farmer email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleMakeAdmin}>
          Make Admin
        </button>
      </div>

      {/*  Admin List */}
      <div>
        <h3 className="text-xl mb-4">Current Admins</h3>

        {loading ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          <div className="grid gap-4">
            {admins.map((user) => (
              <div key={user._id} className="card p-4 shadow">

                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>

                <button
                  className="btn btn-error mt-2"
                  onClick={() => handleRemove(user._id)}
                >
                  Remove Admin
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}