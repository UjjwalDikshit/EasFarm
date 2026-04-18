import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Banner = () => {
  const { home } = useSelector((state) => state.home || {});

  const banners = home?.banners || [];
  const categories = home?.categories || [];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // =====================
  // AUTO SLIDER
  // =====================
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  // =====================
  // EMPTY STATE
  // =====================
  if (!banners.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  // =====================
  // IMAGE SAFE HELPER
  // =====================
  const getImage = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img; // old schema
    return img.url; // new schema
  };

  const getIcon = (icon) => {
    if (!icon) return "";
    if (typeof icon === "string") return icon;
    return icon.url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden shadow-lg">
        {banners.map((item, index) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBannerIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={getImage(item.image)}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {item.title}
              </h2>

              <a href={item.link} className="btn btn-primary">
                Explore Now
              </a>
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentBannerIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      {categories?.length > 0 && (
        <section className="mb-12 px-4">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-8">
            Farm Categories
          </h2>

          <div className="flex flex-wrap justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <figure className="px-6 pt-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <img
                      src={getIcon(category.icon)}
                      alt={category.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </figure>

                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-green-800">{category.name}</h3>

                  <div className="card-actions">
                    <a
                      href={category.link}
                      className="btn btn-sm btn-outline btn-primary mt-4"
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Banner;
