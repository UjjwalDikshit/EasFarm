import { useState } from "react";
import axiosClient from "../../../../utils/axiosClient";

export default function SFCard({ product, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;

    try {
      setLoading(true);

      await axiosClient.post("/service/remove", {
        productId: product._id,
      });

      onUpdate && onUpdate(product._id, "delete");

    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async () => {
    try {
      setLoading(true);

      await axiosClient.put(`/service/product/${product._id}`, {
        price: Number(price),
      });

      onUpdate && onUpdate(product._id, "update", { price });

      setEditing(false);

    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (qty) => {
    try {
      setLoading(true);

      await axiosClient.post("/service/quantity-manipulate", {
        productId: product._id,
        quantity: qty,
      });

      onUpdate && onUpdate(product._id, "stock", { qty });

    } catch (err) {
      alert("Stock update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-xl shadow p-4 hover:shadow-lg transition duration-200 flex flex-col">

      {/* IMAGE */}
      {product.image?.url && (
        <img
          src={product.image.url}
          alt={product.name}
          className="h-40 w-full object-cover rounded-lg mb-3"
        />
      )}

      {/* TITLE */}
      <h3 className="font-semibold text-lg leading-tight">
        {product.name}
      </h3>

      {/* BRAND + CATEGORY */}
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

      {/* WEIGHT */}
      <p className="text-xs text-gray-500">
        {product.weight} {product.weightUnit}
      </p>

      {/* STOCK BADGE */}
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
              className="border border-gray-300 p-1 rounded w-full bg-transparent text-gray-500"
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
          className="w-full bg-red-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Delete"}
        </button>

      </div>
    </div>
  );
}