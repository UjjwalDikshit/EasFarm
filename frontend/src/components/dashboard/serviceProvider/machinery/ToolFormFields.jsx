import React from "react";

export default function ToolFormFields({ form, handleChange }) {
  const categories = [
    "Tractor",
    "Plough",
    "Harvester",
    "Dozer",
    "Loader",
    "Other",
  ];

  const baseInput =
    "w-full border border-gray-300 p-2 rounded bg-transparent text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300";

  return (
    <>
      <input
        type="text"
        name="name"
        placeholder="Tool Name"
        value={form.name}
        onChange={handleChange}
        className={baseInput}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className={baseInput}
      />

      {/* FIXED SELECT */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className={`${baseInput} cursor-pointer`}
      >
        {categories.map((cat) => (
          <option key={cat} className="text-black">
            {cat}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="rentPrice"
        placeholder="Rent Price"
        value={form.rentPrice}
        onChange={handleChange}
        className={baseInput}
        required
      />

      <select
        name="rentUnit"
        value={form.rentUnit}
        onChange={handleChange}
        className={`${baseInput} cursor-pointer`}
      >
        <option value="per_day" className="text-black">
          Per Day
        </option>
        <option value="per_hour" className="text-black">
          Per Hour
        </option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
          className={baseInput}
          required
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={form.lng}
          onChange={handleChange}
          className={baseInput}
          required
        />
      </div>
    </>
  );
}