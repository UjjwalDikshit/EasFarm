import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosClient from "../../../../utils/axiosClient";
import ToolFormFields from "./ToolFormFields";
import ImageUpload from "./ImageUpload";

export default function CreateTool() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Tractor",
    rentPrice: "",
    rentUnit: "per_day",
    lat: "",
    lng: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  }, []);

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
        type: "tools",
        fileType: "image",
      });

      const { timestamp, signature, folder, cloudName, apiKey } = sigRes.data;

      // 2. Upload image to cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      const imageUrl = uploadRes.data.secure_url;

      // 3. Create tool
      const payload = {
        ...form,
        image: imageUrl,
        rentPrice: Number(form.rentPrice),
      };

      await axiosClient.post("/service/tools/register", payload);

      alert("Tool created successfully");
      setForm({
        name: "",
        description: "",
        category: "Tractor",
        rentPrice: "",
        rentUnit: "per_day",
        lat: "",
        lng: "",
      });

      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-grey shadow-xl rounded-2xl space-y-5">
      <h2 className="text-2xl text-green-900 font-bold mb-4">Post Machinery / Tool</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ToolFormFields form={form} handleChange={handleChange} />

        <ImageUpload
          setFile={setFile}
          preview={preview}
          setPreview={setPreview}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Posting..." : "Post Tool"}
        </button>
      </form>
    </div>
  );
}
