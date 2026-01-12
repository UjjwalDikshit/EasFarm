

export default function ToolCard({ tool }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{tool.name}</h3>
          <span className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors cursor-pointer">
            Pay To Rent
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{tool.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-blue-700 font-medium">Category</p>
            <p className="text-sm font-medium text-black">{tool.category}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-blue-700 font-medium">Chat</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-blue-700 font-medium">Price</p>
            <p className="text-sm font-medium text-black">₹{tool.rentPrice} {tool.rentUnit}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 pt-3 border-t border-gray-100">
          <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Provider</p>
            <p className="text-sm font-medium text-black">{tool.serviceProvider?.name || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



// export default function ToolCard({ tool, index }) {
//   return (
//     <div className="card w-80 bg-base-100 shadow-xl border border-blue-100 transition-all duration-300 hover:shadow-2xl">
//       <div className="card-body p-5">
//         {/* Card header with unique ID */}
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded">
//             ID: {tool.id || `T-${index.toString().padStart(3, '0')}`}
//           </span>
//           <div className="badge badge-primary badge-sm">Available</div>
//         </div>

//         {/* Header with icon and title */}
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
//               </svg>
//             </div>
//             <h2 className="card-title text-lg text-blue-800">{tool.name}</h2>
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>

//         {/* Details grid */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="flex items-center gap-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
//               <line x1="7" y1="7" x2="7.01" y2="7"/>
//             </svg>
//             <span className="text-sm">{tool.category}</span>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
//               <line x1="16" y1="2" x2="16" y2="6"/>
//               <line x1="8" y1="2" x2="8" y2="6"/>
//               <line x1="3" y1="10" x2="21" y2="10"/>
//             </svg>
//             <span className="text-sm font-medium">₹{tool.rentPrice}/{tool.rentUnit}</span>
//           </div>
          
//           <div className="flex items-center gap-2 col-span-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
//               <circle cx="12" cy="7" r="4"/>
//             </svg>
//             <span className="text-sm truncate">{tool.serviceProvider?.name || "N/A"}</span>
//           </div>
//         </div>

//         {/* Action buttons and rating */}
//         <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
//           <button className="btn btn-primary btn-sm rounded-full px-4">
//             Rent Now
//           </button>
          
//           <div className="flex items-center">
//             <div className="rating rating-xs mr-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <input 
//                   key={star} 
//                   type="radio" 
//                   name={`rating-${tool.id || index}`} 
//                   className="mask mask-star-2 bg-yellow-400" 
//                   defaultChecked={star === 4}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-500">(12)</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }