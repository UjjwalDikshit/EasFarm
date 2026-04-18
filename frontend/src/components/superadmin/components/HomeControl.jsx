import ImageUpload from "../../dashboard/serviceProvider/machinery/ImageUpload";
import axiosClient from "../../../utils/axiosClient";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  getHome,
  addBanner,
  deleteBanner,
  addCategory,
  deleteCategory,
} from "../services/superAdminService";

export default function HomeControl() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  // Banner state
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Category state
  const [catName, setCatName] = useState("");
  const [catLink, setCatLink] = useState("");
  const [catIcon, setCatIcon] = useState(null);
  const [catPreview, setCatPreview] = useState(null);

  const [loadingBanner, setLoadingBanner] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // =====================
  // FETCH HOME
  // =====================
  const fetchHome = async () => {
    const res = await getHome();

    const home = res.data.home;

    setBanners(home?.banners || []);
    setCategories(home?.categories || []);
  };

  useEffect(() => {
    fetchHome();
  }, []);

  // =====================
  // ADD BANNER
  // =====================
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!file) return alert("Image required");

    try {
      setLoadingBanner(true);

      const sigRes = await axiosClient.post("/cloudinary/signature", {
        type: "home",
        fileType: "image",
      });

      const { timestamp, signature, folder, cloudName, apiKey } = sigRes.data;

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

      await addBanner({
        title,
        link,
        image: {
          url: uploadRes.data.secure_url,
          public_id: uploadRes.data.public_id,
        },
      });

      setTitle("");
      setLink("");
      setFile(null);
      setPreview(null);

      fetchHome();
    } catch (err) {
      console.error(err);
      alert("Failed to add banner");
    } finally {
      setLoadingBanner(false);
    }
  };

  // =====================
  // ADD CATEGORY
  // =====================
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catIcon) return alert("Icon required");

    try {
      setLoadingCategory(true);

      const sigRes = await axiosClient.post("/cloudinary/signature", {
        type: "home",
        fileType: "image",
      });

      const { timestamp, signature, folder, cloudName, apiKey } = sigRes.data;

      const formData = new FormData();
      formData.append("file", catIcon);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      await addCategory({
        name: catName,
        link: catLink,
        icon: {
          url: uploadRes.data.secure_url,
          public_id: uploadRes.data.public_id,
        },
      });

      setCatName("");
      setCatLink("");
      setCatIcon(null);
      setCatPreview(null);

      fetchHome();
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    } finally {
      setLoadingCategory(false);
    }
  };

  // =====================
  // DELETE BANNER
  // =====================
  const handleDeleteBanner = async (id) => {
    await deleteBanner(id);
    fetchHome();
  };

  // =====================
  // DELETE CATEGORY
  // =====================
  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    fetchHome();
  };

  const getImage = (img) => {
    if (!img) return "";

    // old schema: string
    if (typeof img === "string") return img;

    // new schema: object
    return img.url || "";
  };

  const getIcon = (icon) => {
    if (!icon) return "";

    // old schema: string
    if (typeof icon === "string") return icon;

    // new schema: object
    return icon.url || "";
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold">Homepage Control</h2>

      {/* ================= BANNER FORM ================= */}
      <form onSubmit={handleAddBanner} className="card p-4 shadow space-y-4">
        <h3 className="font-semibold">Add Banner</h3>

        <input
          className="input input-bordered w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <ImageUpload
          setFile={setFile}
          preview={preview}
          setPreview={setPreview}
        />

        <button className="btn btn-primary" disabled={loadingBanner}>
          {loadingBanner ? "Uploading..." : "Add Banner"}
        </button>
      </form>

      {/* ================= CATEGORY FORM ================= */}
      <form onSubmit={handleAddCategory} className="card p-4 shadow space-y-4">
        <h3 className="font-semibold">Add Category</h3>

        <input
          className="input input-bordered w-full"
          placeholder="Category Name"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Link"
          value={catLink}
          onChange={(e) => setCatLink(e.target.value)}
        />

        <ImageUpload
          setFile={setCatIcon}
          preview={catPreview}
          setPreview={setCatPreview}
        />

        <button className="btn btn-secondary" disabled={loadingCategory}>
          {loadingCategory ? "Uploading..." : "Add Category"}
        </button>
      </form>

      {/* ================= BANNERS ================= */}
      <div>
        <h3 className="text-xl mb-4">Existing Banners</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b._id} className="card shadow p-3">
              <img
                src={getImage(b.image)}
                className="h-40 w-full object-cover rounded"
                alt={b.title}
              />

              <h4 className="mt-2 font-semibold">{b.title}</h4>
              <p className="text-sm text-gray-500">{b.link}</p>

              <button
                className="btn btn-error mt-2"
                onClick={() => handleDeleteBanner(b._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div>
        <h3 className="text-xl mb-4">Existing Categories</h3>

        <div className="grid md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card p-3 shadow">
              <img
                src={getIcon(c.icon)}
                className="h-20 w-full object-cover rounded"
                alt={c.name}
              />

              <p className="font-semibold mt-2">{c.name}</p>
              <p className="text-sm text-gray-500">{c.link}</p>

              <button
                className="btn btn-error mt-2"
                onClick={() => handleDeleteCategory(c._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
