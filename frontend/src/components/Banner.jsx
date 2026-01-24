import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Banner = () => {
  const { banner, cards } = useSelector((state) => state.home);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  
  // Auto-rotate banners
  useEffect(() => {
    if (!banner || banner.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === banner.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banner]);

  if (!banner || banner.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-8">
        <div className="flex items-center justify-center h-64 md:h-96 bg-gray-200 rounded-xl">
          <p className="text-gray-500">No banners available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Banner Carousel */}
      <div className="relative w-full h-64 md:h-96 mb-12  overflow-hidden shadow-lg">
        {banner.map((bannerItem, index) => (
          <div 
            key={bannerItem._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={bannerItem.image} 
              alt={bannerItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{bannerItem.title}</h2>
              <a href={bannerItem.link} className="btn btn-primary">Explore Now</a>
            </div>
          </div>
        ))}
        
        {/* Banner navigation dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banner.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentBannerIndex(index)}
              aria-label={`View banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      {cards && cards.length > 0 && (
        <section className="mb-12 px-4">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-8">Farm Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cards.map((category) => (
              <div key={category._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="px-6 pt-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </figure>
                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-green-800">{category.name}</h3>
                  <div className="card-actions">
                    <a href={category.link} className="btn btn-sm btn-outline btn-primary mt-4 ">Explore</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section (Optional) */}
      <section className="pb-20 px-4">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Organic Fertilizer", price: "$24.99", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", link: "#" },
            { name: "Garden Tools Set", price: "$39.99", image: "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", link: "#" },
            { name: "Greenhouse Kit", price: "$199.99", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", link: "#" }
          ].map((product, index) => (
            <div key={index} className="card bg-base-100 shadow-xl image-full hover:scale-105 transition-transform duration-300">
              <figure>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
              </figure>
              <div className="card-body justify-end">
                <h3 className="card-title text-white">{product.name}</h3>
                <p className="text-white">{product.price}</p>
                <div className="card-actions">
                  <a href={product.link} className="btn btn-primary">Add to Cart</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Banner;