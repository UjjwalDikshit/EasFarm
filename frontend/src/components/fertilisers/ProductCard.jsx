export default function ProductCard({ product }) {
  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="card card-compact bg-base-100 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
      <figure className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105" 
        />
        {product.discount > 0 && (
          <div className="badge badge-primary absolute top-3 right-3 border-0 text-white font-bold">
            {product.discount}% OFF
          </div>
        )}
        {!product.stockAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-bold bg-red-500 px-3 py-1 rounded-lg">Out of Stock</span>
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="card-title text-base text-blue-900">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <div className="badge badge-outline badge-primary">{product.category}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="rating rating-sm">
            {[...Array(5)].map((_, i) => (
              <input 
                key={i}
                type="radio" 
                name={`rating-${product.id}`} 
                className="mask mask-star-2 bg-yellow-400" 
                checked={i < Math.floor(product.rating)}
                readOnly
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-blue-700">₹{finalPrice.toLocaleString()}</p>
            {product.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</p>
            )}
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${product.stockAvailable ? 'text-green-600' : 'text-red-500'}`}>
              {product.stockAvailable ? 'In Stock' : 'Out of Stock'}
            </p>
            <p className="text-xs text-gray-500">Seller: {product.serviceProvider?.name || 'Direct'}</p>
          </div>
        </div>
        
        <div className="card-actions justify-between">
          <button 
            className="btn btn-outline btn-sm btn-circle"
            disabled={!product.stockAvailable}
            title="Add to wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            className="btn btn-primary btn-sm flex-1 ml-2"
            disabled={!product.stockAvailable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// export default function ProductCard({ product }) {
//   const finalPrice = product.price - (product.price * product.discount) / 100;

//   return (
//     <div className="bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
//       {/* Product Image with overlay */}
//       <div className="relative overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
//         />
//         {product.discount > 0 && (
//           <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//             {product.discount}% OFF
//           </div>
//         )}
//       </div>

//       {/* Card Content */}
//       <div className="p-5">
//         {/* Category & Brand */}
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
//             {product.category}
//           </span>
//           <span className="text-xs font-semibold text-gray-500">
//             {product.brand}
//           </span>
//         </div>

//         {/* Title */}
//         <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
//           {product.name}
//         </h3>

//         {/* Rating */}
//         <div className="flex items-center mb-3">
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <svg
//                 key={i}
//                 className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             ))}
//           </div>
//           <span className="text-sm text-gray-600 ml-1">
//             ({product.rating.toFixed(1)})
//           </span>
//         </div>

//         {/* Price */}
//         <div className="flex items-center mb-3">
//           <span className="text-xl font-bold text-blue-700">₹{finalPrice.toLocaleString()}</span>
//           {product.discount > 0 && (
//             <span className="text-sm text-gray-500 line-through ml-2">
//               ₹{product.price.toLocaleString()}
//             </span>
//           )}
//         </div>

//         {/* Stock & Seller */}
//         <div className="flex justify-between items-center mb-4">
//           <span className={`text-sm font-medium ${product.stockAvailable ? "text-green-600" : "text-red-500"}`}>
//             {product.stockAvailable ? "✓ In Stock" : "✗ Out of Stock"}
//           </span>
//           <span className="text-xs text-gray-500">
//             Seller: {product.serviceProvider?.name || "Direct"}
//           </span>
//         </div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-2 gap-2">
//           <button 
//             className={`btn btn-outline btn-sm ${!product.stockAvailable && 'btn-disabled'}`}
//             disabled={!product.stockAvailable}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//             Wishlist
//           </button>
//           <button 
//             className={`btn btn-primary btn-sm ${!product.stockAvailable && 'btn-disabled'}`}
//             disabled={!product.stockAvailable}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }