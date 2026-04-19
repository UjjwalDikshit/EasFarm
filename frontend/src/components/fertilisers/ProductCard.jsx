import React from "react";
import PaymentButton from "../PaymentButton";

export default function ProductCard({ product }) {
  const hasDiscount = product.discount > 0;
  const finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  const handleChat = () => {
    if (product?.chat?.uniqueId) {
      window.open(`http://localhost:5173/`, "_blank");
    }
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* IMAGE */}
      <div className="relative h-44 bg-base-200 flex items-center justify-center p-4">
        <img
          src={product.image?.url || "/api/placeholder/300/200"}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />

        {/* Organic */}
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-success text-success-content text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            ORGANIC
          </span>
        )}

        {/* Discount */}
        {hasDiscount && product.stockAvailable && (
          <div className="absolute top-2 right-2 bg-primary text-primary-content text-[10px] font-bold px-2 py-0.5 rounded">
            {product.discount}% OFF
          </div>
        )}

        {/* Out of stock */}
        {!product.stockAvailable && (
          <div className="absolute inset-0 bg-base-100/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-error text-error-content text-xs font-bold px-3 py-1 rounded shadow-lg">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-4">
        {/* Category + Rating */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs font-medium text-warning">
            ⭐ {product.rating || "New"}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-base-content truncate mb-0.5">
          {product.name}
        </h3>

        <p className="text-xs text-base-content/60 mb-3">
          {product.brand} • {product.weight}
          {product.weightUnit}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between bg-base-200 border border-base-300 rounded-lg p-3 mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-base-content">
                ₹{finalPrice}
              </span>

              {hasDiscount && (
                <span className="text-xs text-base-content/50 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            <p className="text-[10px] text-primary font-medium leading-none">
              Net Price
            </p>
          </div>

          <PaymentButton
            amount={finalPrice}
            disabled={!product.stockAvailable}
          />
        </div>

        {/* SELLER */}
        <div className="flex items-center pt-3 border-t border-base-300">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-base-content/50 font-bold uppercase mb-1">
              Seller
            </p>

            <p className="text-xs font-bold text-base-content truncate">
              {product.seller?.name || "Verified Farmer"}
            </p>

            <p className="text-[10px] text-primary mt-1 font-mono">
              ID: {product?.chat?.uniqueId || "N/A"}
            </p>
          </div>

          <button
            onClick={handleChat}
            disabled={!product?.chat?.uniqueId}
            className="px-3 py-1.5 text-[11px] font-bold border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-content transition-colors disabled:border-base-300 disabled:text-base-content/30"
          >
            CHAT
          </button>
        </div>
      </div>
    </div>
  );
}