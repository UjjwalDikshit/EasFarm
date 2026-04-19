import { useState } from "react";

export default function FilterBar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const handleApply = (newCategory, newSort) => {
    onFilterChange({
      category: newCategory,
      sort: newSort,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-black shadow p-4 rounded sticky top-0 z-10">
      
      {/* CATEGORY FILTER */}
      <select
        value={category}
        onChange={(e) => {
          const value = e.target.value;
          setCategory(value);
          handleApply(value, sort);
        }}
        className="border rounded p-2 text-yellow-400 bg-black"
      >
        <option value="">All Categories</option>
        <option value="Tractor">Tractor</option>
        <option value="Loader">Loader</option>
      </select>

      {/* SORT FILTER */}
      <select
        value={sort}
        onChange={(e) => {
          const value = e.target.value;
          setSort(value);
          handleApply(category, value);
        }}
        className="border rounded p-2 text-black bg-white"
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>

    </div>
  );
}