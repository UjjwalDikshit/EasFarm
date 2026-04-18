import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // ================= FETCH =================
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/admin/reports?status=${status}`
      );
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [status]);

  // ================= REVIEW =================
  const markReviewed = async (id) => {
    try {
      setActionLoading(id);

      await axiosClient.put(`/admin/reports/${id}/review`);

      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "reviewed" } : r
        )
      );

    } catch (err) {
      alert("Failed to mark reviewed");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= RESOLVE =================
  const resolveReport = async (id) => {
    try {
      setActionLoading(id);

      await axiosClient.put(`/admin/reports/${id}/resolve`);

      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "resolved" } : r
        )
      );

    } catch (err) {
      alert("Failed to resolve report");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= DELETE TARGET =================
  const handleDeleteTarget = async (report) => {
    const ok = window.confirm(
      "Are you sure you want to delete this content permanently?"
    );
    if (!ok) return;

    try {
      setActionLoading(report._id);

      await axiosClient.delete(
        `/admin/reports/delete-target/${report.targetType}/${report.targetId}`
      );

      setReports((prev) =>
        prev.filter((r) => r._id !== report._id)
      );

    } catch (err) {
      alert("Failed to delete content");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= STATUS BADGE =================
  const statusBadge = (s) => {
    if (s === "pending") return "badge-warning";
    if (s === "reviewed") return "badge-info";
    if (s === "resolved") return "badge-success";
    return "badge-ghost";
  };

  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Reports Management</h2>

        <button
          onClick={fetchReports}
          className="btn btn-outline btn-sm"
        >
          Refresh
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        {["pending", "reviewed", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`btn btn-sm ${
              status === s ? "btn-primary" : "btn-outline"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton h-24 w-full rounded-lg"
            ></div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && reports.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No reports found
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-4">

        {reports.map((r) => (
          <div
            key={r._id}
            className="card bg-base-100 shadow-md border hover:shadow-lg transition"
          >
            <div className="card-body space-y-3">

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="font-bold text-lg">
                    Report Type: {r.type}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Target: {r.targetType}
                  </p>
                </div>

                <span className={`badge ${statusBadge(r.status)}`}>
                  {r.status}
                </span>

              </div>

              {/* DETAILS */}
              <div className="text-sm text-gray-600 space-y-1">

                <p>
                  <strong>Target ID:</strong> {r.targetId}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {r.reason || "No reason provided"}
                </p>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 pt-2">

                {r.status !== "reviewed" && (
                  <button
                    disabled={actionLoading === r._id}
                    onClick={() => markReviewed(r._id)}
                    className="btn btn-warning btn-sm"
                  >
                    Mark Reviewed
                  </button>
                )}

                {r.status !== "resolved" && (
                  <button
                    disabled={actionLoading === r._id}
                    onClick={() => resolveReport(r._id)}
                    className="btn btn-success btn-sm"
                  >
                    Resolve
                  </button>
                )}

                <button
                  disabled={actionLoading === r._id}
                  onClick={() => handleDeleteTarget(r)}
                  className="btn btn-error btn-sm"
                >
                  Delete Content
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}