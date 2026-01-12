import { useState } from "react";

export default function ProductFilterBar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [organic, setOrganic] = useState("");
  const [sort, setSort] = useState("");

  const handleApply = () => {
    onFilterChange({ category, brand, isOrganic: organic, sort });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-black shadow p-4 sticky top-0 z-10">
      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded p-2 bg-gradient-to-r from-blue-300 to-blue-600 text-white"
      >
        <option value="" className="bg-amber-300">All Categories</option>
        <option value="Seed" className="bg-amber-300">Seeds</option>
        <option value="Fertiliser" className="bg-amber-300">Fertilisers</option>
      </select>

      {/* Brand */}
      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="border rounded p-2 bg-yellow"
      />

      {/* Organic */}
      <select
        value={organic}
        onChange={(e) => setOrganic(e.target.value)}
        className="border rounded p-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 text-white"

      >
        <option value="" className="bg-amber-300">All Types</option>
        <option value={true} className="bg-amber-300">Organic</option>
        <option value={false} className="bg-amber-300">Non-Organic</option>
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded p-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 text-white"

      >
        <option value="" className="bg-amber-300">Sort By</option>
        <option value="price-asc" className="bg-amber-300">Price: Low → High</option>
        <option value="price-desc" className="bg-amber-300">Price: High → Low</option>
        <option value="rating-desc" className="bg-amber-300">Rating: High → Low</option>
      </select>

      <button
        onClick={handleApply}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Apply
      </button>
    </div>
  );
}
