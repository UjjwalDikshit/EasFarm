import { useState,useEffect } from "react";
import { Filter, RotateCcw, SortAsc, Tag, Leaf } from "lucide-react";

export default function ProductFilterBar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [organic, setOrganic] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");


  const handleApply = () => {
    onFilterChange({ category, brand, isOrganic: organic, sort });
  };

  const handleReset = () => {
    setCategory("");
    setBrand("");
    setOrganic("");
    setSort("");
    onFilterChange({ category: "", brand: "", isOrganic: "", sort: "" });
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChange((prev) => ({ ...prev, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="sticky top-16 z-30 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        {/* Category Select */}
        <div className="relative flex items-center">
          <Tag className="absolute left-3 text-base-content/50" size={16} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered select-sm pl-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            <option value="Seed">Seeds</option>
            <option value="Fertiliser">Fertilisers</option>
            <option value="Pesticide">Pesticides</option>
            <option value="Tool">Farm Tools</option>
          </select>
        </div>

        {/* Brand Input */}
        <input
          type="text"
          placeholder="Search Brand..."
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="input input-bordered input-sm h-10 w-full md:w-40 focus:outline-none"
        />

        {/* Organic Toggle */}
        <div className="relative flex items-center">
          <Leaf className="absolute left-3 text-success" size={16} />
          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="select select-bordered select-sm pl-10 h-10 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="true">Organic</option>
            <option value="false">Inorganic</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="relative flex items-center">
          <SortAsc className="absolute left-3 text-base-content/50" size={16} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered select-sm pl-10 h-10 focus:outline-none"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm h-10 gap-2 text-base-content/70 hover:text-error"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleApply}
            className="btn btn-primary btn-sm h-10 gap-2 shadow-md px-6"
          >
            <Filter size={16} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
