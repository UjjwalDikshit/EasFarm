import { useState } from "react";

export default function FilterBar({ onFilterChange }) {
  const [category, setCatergory] = useState("");
  const [sort, setSort] = useState("");

  const handleApply = () => {
    onFilterChange({ category, sort });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-black shadow p-4 rounded sticky top-0 z - 10">
      {/*category filter */}
      <select
        value={category}
        onChange={(e) =>{ setCatergory(e.target.value); handleApply()}}
        className="border rounded p-2 text-yellow"
      >
        <option value="">All Categories</option>
        <option value="Tractor">Tractor</option>
        <option value="Loader">Loader</option>
      </select>

        {/* sort filter */}
      <select
        value={sort}
        onChange={(e)=>{setSort(e.target.value); handleApply()}}
        className="border rounded p-2 text-black"
        >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
        </select>
    </div>
  );
}
