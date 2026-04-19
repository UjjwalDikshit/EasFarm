import { useEffect, useState } from "react";
import axiosClient from "../../../../utils/axiosClient";
import SFCard from "./SFCard";
import { Leaf } from "lucide-react";

export default function SFListSection({ enabled }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axiosClient.get("/service/get-my-seed");
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    if (enabled) fetchProducts();
  }, [enabled]);

  // =========================
  // SINGLE CLEAN HANDLER
  // =========================
  const handleUpdate = (id, type, data) => {
    if (type === "delete") {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }

    if (type === "restore") {
      setProducts((prev) => [data, ...prev]);
    }

    if (type === "update") {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...data } : p))
      );
    }

    if (type === "stock") {
      fetchProducts(); // keep simple
    }
  };

  // =========================
  // EMPTY STATE
  // =========================
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <div className="bg-base-200 p-6 rounded-full mb-4">
          <Leaf size={40} />
        </div>

        <h2 className="text-lg font-semibold mb-1">
          No products listed yet
        </h2>

        <p className="text-sm">
          Start by adding your first seed or fertiliser product
        </p>
      </div>
    );
  }

  // =========================
  // LIST
  // =========================
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <SFCard
          key={product._id}
          product={product}
          onUpdate={handleUpdate} // 
        />
      ))}
    </div>
  );
}