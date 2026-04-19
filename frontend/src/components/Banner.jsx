import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sprout } from "lucide-react";

const Banner = () => {
  const { home } = useSelector((state) => state.home || {});
  const navigate = useNavigate();

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
  }, [banners.length]);

  // =====================
  // HELPERS
  // =====================
  const getImageUrl = (img) => {
    if (!img) return "";
    return typeof img === "string" ? img : img.url;
  };

  const handleAction = (path) => {
    if (path) navigate(path);
  };

  if (!banners.length && !categories.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50">
        <Sprout size={48} className="text-gray-300 mb-4 animate-pulse" />
        <p className="text-gray-500 font-medium">
          Preparing fresh farm data...
        </p>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-base-200 to-base-300 pb-12">
      {/* BANNER */}
      {banners.length > 0 && (
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden shadow-2xl">
          {banners.map((item, index) => (
            <div
              key={item._id || index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentBannerIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-base-content/80 via-base-content/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-6xl font-bold text-base-100 mb-4">
                    {item.title}
                  </h2>

                  <button
                    onClick={() => handleAction(item.link)}
                    className="btn btn-primary btn-md md:btn-lg gap-2 shadow-lg"
                  >
                    Explore Now <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentBannerIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-base-100/60 hover:bg-base-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      {categories?.length > 0 && (
        <section className="mt-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-base-content">
              Farm Categories
            </h2>

            <div className="h-1 flex-1 bg-base-300 ml-6 rounded-full hidden md:block"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group bg-base-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-base-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500">
                  <img
                    src={getImageUrl(category.icon)}
                    alt={category.name}
                    className="w-12 h-12 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                  />
                </div>

                <h3 className="text-lg font-bold text-base-content mb-4">
                  {category.name}
                </h3>

                <button
                  onClick={() => handleAction(category.link)}
                  className="mt-auto flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-focus"
                >
                  Explore
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Banner;
