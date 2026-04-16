import React from "react";

export default function ImageUpload({ setFile, preview, setPreview }) {
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImage} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-2 h-40 rounded object-cover"
        />
      )}
    </div>
  );
}