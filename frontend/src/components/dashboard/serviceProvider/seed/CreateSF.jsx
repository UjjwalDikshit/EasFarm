import { useState } from "react";
import axiosClient from "../../../../utils/axiosClient";
import ImageUpload from "../machinery/ImageUpload";
import axios from "axios";

export default function CreateSF({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    category: "Fertiliser",
    brand: "",
    price: "",
    stockQuantity: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseInput =
    "w-full border border-gray-300 p-2 rounded bg-transparent text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Image required");

    try {
      setLoading(true);

      //  1. Get signature
      const sigRes = await axiosClient.post("/cloudinary/signature", {
        type: "product",
        fileType: "image",
      });

      const { timestamp, signature, folder, cloudName, apiKey } =
        sigRes.data;

      //  2. Upload image
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      //  3. Create product
      await axiosClient.post("/service/sell", {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        imageUrl: uploadRes.data.secure_url,
        public_id: uploadRes.data.public_id,
      });

      //  RESET FORM
      setForm({
        name: "",
        category: "Fertiliser",
        brand: "",
        price: "",
        stockQuantity: "",
        description: "",
      });

      setFile(null);
      setPreview(null);

      onSuccess && onSuccess();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-grey shadow-xl rounded-2xl space-y-5">

      <h2 className="text-2xl text-green-900 font-semibold mb-4">
        Sell Seed / Fertiliser
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className={baseInput}
          required
        />

        {/* BRAND */}
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className={baseInput}
          required
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`${baseInput} cursor-pointer`}
        >
          <option value="Seed" className="text-black">Seed</option>
          <option value="Fertiliser" className="text-black">Fertiliser</option>
          <option value="Pesticide" className="text-black">Pesticide</option>
        </select>

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className={baseInput}
          required
        />

        {/* STOCK */}
        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          className={baseInput}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={baseInput}
        />

        {/* IMAGE UPLOAD (SAME AS TOOL) */}
        <ImageUpload
          setFile={setFile}
          preview={preview}
          setPreview={setPreview}
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Posting..." : "Sell Product"}
        </button>

      </form>
    </div>
  );
}