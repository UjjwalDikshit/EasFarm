import { useState } from "react";
import axiosClient from "../../../../utils/axiosClient";
import { Trash2, Loader2 } from "lucide-react";

export default function ToolCard({ tool, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    const confirmDelete = window.confirm("Delete this tool?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axiosClient.delete(`/service/tool/${tool._id}`);

      // Optimistic UI update
      onDelete && onDelete(tool._id);

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete tool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-xl shadow p-4 hover:shadow-lg transition relative">

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      </button>

      {/* Image */}
      {tool.image?.url && (
        <img
          src={tool.image.url}
          alt={tool.name}
          className="h-40 w-full object-cover rounded mb-3"
        />
      )}

      {/* Title */}
      <h3 className="font-bold text-lg">{tool.name}</h3>

      {/* Category */}
      <p className="text-sm text-gray-500">{tool.category}</p>

      {/* Description */}
      <p className="text-sm mt-2 line-clamp-2">
        {tool.description}
      </p>

      {/* Price */}
      <div className="mt-3 font-semibold">
        ₹{tool.rentPrice} / {tool.rentUnit.replace("_", " ")}
      </div>

      {/* Status */}
      <div className="mt-2">
        <span
          className={`badge ${
            tool.available ? "badge-success" : "badge-error"
          }`}
        >
          {tool.available ? "Available" : "Not Available"}
        </span>
      </div>

    </div>
  );
}