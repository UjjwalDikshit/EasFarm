import { useState } from "react";
import axiosClient from "../../../../utils/axiosClient";
import { Trash2, Loader2 } from "lucide-react";

export default function SFCard({ product, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false); // 👈 new

  const handleDelete = async () => {
    // 👇 Replace confirm with better UX later
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    // =========================
    // OPTIMISTIC REMOVE
    // =========================
    setDeleting(true);
    onUpdate && onUpdate(product._id, "delete"); // remove instantly

    try {
      await axiosClient.post("/service/remove", {
        productId: product._id,
      });

    } catch (err) {
      // =========================
      // ROLLBACK if failed
      // =========================
      onUpdate && onUpdate(product._id, "restore", product);

      alert("Delete failed");
    }
  };

  return (
    <div
      className={`bg-base-200 rounded-xl shadow p-4 hover:shadow-lg transition-all duration-300 flex flex-col
      ${deleting ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >

      {/* IMAGE */}
      {product.image?.url && (
        <img
          src={product.image.url}
          alt={product.name}
          className="h-40 w-full object-cover rounded-lg mb-3"
        />
      )}

      {/* TITLE */}
      <h3 className="font-semibold text-lg">{product.name}</h3>

      {/* META */}
      <p className="text-sm text-gray-500">
        {product.brand} • {product.category}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm mt-2 text-gray-400 line-clamp-2">
        {product.description}
      </p>

      {/* PRICE */}
      <div className="mt-3 font-semibold text-base">
        ₹{product.price}
        {product.discount > 0 && (
          <span className="text-green-500 text-sm ml-2">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* STOCK */}
      <div className="mt-2">
        <span
          className={`badge ${
            product.stockAvailable ? "badge-success" : "badge-error"
          }`}
        >
          {product.stockAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex flex-col gap-2">

        {/* EDIT PRICE */}
        {editing ? (
          <div className="flex gap-2">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-1 rounded w-full bg-transparent"
            />

            <button
              onClick={handlePriceUpdate}
              className="bg-green-600 text-white px-3 rounded"
              disabled={loading}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-yellow-500 text-white p-2 rounded"
          >
            Edit Price
          </button>
        )}

        {/* STOCK */}
        <div className="flex gap-2">
          <button
            onClick={() => updateStock(1)}
            className="flex-1 bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            Sell 1
          </button>

          <button
            onClick={() => updateStock(5)}
            className="flex-1 bg-blue-700 text-white p-2 rounded"
            disabled={loading}
          >
            Sell 5
          </button>
        </div>

        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white p-2 rounded flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Processing...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Delete
            </>
          )}
        </button>

      </div>
    </div>
  );
}