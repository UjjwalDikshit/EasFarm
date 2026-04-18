import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ================= FETCH SCHEMES =================
  const fetchSchemes = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get("/admin/schemes");

      // only active + verified schemes for users
      const filtered = (res.data.data || []).filter(
        (s) => s.isActive && s.verified
      );

      setSchemes(filtered);
    } catch (err) {
      console.error(err);
      alert("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // ================= FILTER =================
  const filteredSchemes = schemes.filter((s) =>
    `${s.title} ${s.shortTitle} ${s.category} ${s.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-100 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          Government Schemes
        </h1>

        <input
          type="text"
          placeholder="Search schemes..."
          className="input input-bordered w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton h-40 w-full rounded-xl"
            />
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && filteredSchemes.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl font-semibold">
            No Schemes Found
          </p>
          <p className="text-sm">
            Try searching with different keywords
          </p>
        </div>
      )}

      {/* ================= SCHEMES LIST ================= */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredSchemes.map((s) => (
          <div
            key={s._id}
            className="card bg-base-100 shadow-md border hover:shadow-xl transition-all"
          >

            <div className="card-body space-y-3">

              {/* TITLE */}
              <div>
                <h2 className="text-xl font-bold">
                  {s.title}
                </h2>

                {s.shortTitle && (
                  <p className="text-sm text-gray-500">
                    {s.shortTitle}
                  </p>
                )}
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2">

                <span className="badge badge-outline">
                  {s.category}
                </span>

                {s.department && (
                  <span className="badge badge-ghost">
                    {s.department}
                  </span>
                )}

              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {s.description}
              </p>

              {/* REGION */}
              {s.region?.length > 0 && (
                <p className="text-xs text-gray-500">
                  📍 {s.region.join(", ")}
                </p>
              )}

              {/* BENEFITS PREVIEW */}
              {s.benefits?.length > 0 && (
                <ul className="text-xs text-gray-600 list-disc ml-4">
                  {s.benefits.slice(0, 2).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}

              {/* ACTION */}
              <div className="mt-3 flex justify-between items-center">

                {s.applicationLink ? (
                  <a
                    href={s.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Apply Now
                  </a>
                ) : (
                  <button className="btn btn-disabled btn-sm">
                    No Link
                  </button>
                )}

                <button className="btn btn-outline btn-sm">
                  View Details
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}