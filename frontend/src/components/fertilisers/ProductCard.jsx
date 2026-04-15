import React from 'react';
import PaymentButton from "../PaymentButton";

export default function ProductCard({ product }) {
  // Simple Price Logic
  const hasDiscount = product.discount > 0;
  const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

  const handleChat = () => {
    if (product?.chat?.uniqueId) {
      window.open(
        `http://localhost:5173/`,// /${product.chat.uniqueId}
        "_blank"
      );
    }
  }

  return (
    <div key={product._id} className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      
      {/* 1. IMAGE SECTION */}
      <div className="relative h-44 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.image || "/api/placeholder/300/200"}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
        
        {/* Organic Badge */}
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            ORGANIC
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && product.stockAvailable && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {product.discount}% OFF
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.stockAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* 2. BODY SECTION */}
      <div className="p-4">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs font-medium text-yellow-600">
            ⭐ {product.rating || "New"}
          </span>
        </div>

        {/* Name & Brand */}
        <h3 className="text-base font-bold text-gray-900 truncate mb-0.5">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {product.brand} • {product.weight}{product.weightUnit}
        </p>

        {/* Price & Payment Row */}
        <div className="flex items-center justify-between bg-blue-50/50 border border-blue-50 rounded-lg p-3 mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{finalPrice}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              )}
            </div>
            <p className="text-[10px] text-blue-700 font-medium leading-none">Net Price</p>
          </div>

          <PaymentButton amount={finalPrice} disabled={!product.stockAvailable} />
        </div>

        {/* 3. SELLER / CHAT FOOTER */}
        <div className="flex items-center pt-3 border-t border-gray-100">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Seller</p>
            <p className="text-xs font-bold text-gray-800 truncate leading-none">
              {product.seller?.name || "Verified Farmer"}
            </p>
            <p className="text-[10px] text-blue-600 mt-1 font-mono">
              ID: {product?.chat?.uniqueId || "N/A"}
            </p>
          </div>

          <button
            onClick={handleChat}
            disabled={!product?.chat?.uniqueId}
            className="px-3 py-1.5 text-[11px] font-bold border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors disabled:border-gray-300 disabled:text-gray-300"
          >
            CHAT
          </button>
        </div>
      </div>
    </div>
  );
}