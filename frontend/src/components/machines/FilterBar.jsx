import { useState } from "react";
import { Filter, SortAsc, LayoutGrid, RotateCcw } from "lucide-react";

export default function FilterBar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const handleApply = (newCategory, newSort) => {
    onFilterChange({
      category: newCategory,
      sort: newSort,
    });
  };

  const handleReset = () => {
    setCategory("");
    setSort("");
    onFilterChange({ category: "", sort: "" });
  };

  return (
    <div className="sticky top-16 z-20 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
        
        {/* Category Filter */}
        <div className="relative flex items-center group">
          <LayoutGrid className="absolute left-3 text-primary transition-colors group-focus-within:text-primary-focus" size={18} />
          <select
            value={category}
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value);
              handleApply(value, sort);
            }}
            className="select select-bordered select-sm pl-10 h-10 w-full md:w-48 bg-base-100 focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">All Categories</option>
            <option value="Tractor">Tractors</option>
            <option value="Loader">Loaders</option>
            <option value="Harvester">Harvesters</option>
            <option value="Plow">Plows</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="relative flex items-center group">
          <SortAsc className="absolute left-3 text-primary transition-colors group-focus-within:text-primary-focus" size={18} />
          <select
            value={sort}
            onChange={(e) => {
              const value = e.target.value;
              setSort(value);
              handleApply(category, value);
            }}
            className="select select-bordered select-sm pl-10 h-10 w-full md:w-48 bg-base-100 focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {(category || sort) && (
            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm h-10 gap-2 text-error hover:bg-error/10"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
          
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Active Filters</span>
          </div>
        </div>

      </div>
    </div>
  );
}