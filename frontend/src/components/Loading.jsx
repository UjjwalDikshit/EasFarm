export default function Loading(){
    return (
    <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-10">
        <div className="card-body items-center text-center">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <h2 className="card-title text-gray-700">Loading</h2>
            <p className="text-gray-500">Fetching data from API...</p>
        </div>
    </div>
    );
}

// export default function Loading(){
//     return (
//         <div className="flex items-center justify-center p-8">
//             <div className="text-center">
//                 <span className="loading loading-bars loading-lg text-info"></span>
//                 <p className="mt-2 text-gray-500">Processing your request</p>
//             </div>
//         </div>
//     );
// }


// export default function Loading(){
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-4">
//             {/* Spinner with DaisyUI classes */}
//             <div className="flex flex-col items-center space-y-4">
//                 <span className="loading loading-spinner loading-lg text-primary"></span>
                
//                 {/* Optional loading text */}
//                 <p className="text-lg font-medium text-gray-600">Loading data...</p>
                
//                 {/* Optional progress bar */}
//                 <div className="w-64 bg-gray-200 rounded-full h-2">
//                 <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
//                 </div>
//             </div>

//             {/* Alternative: Skeleton loader */}
//             <div className="mt-8 space-y-4 hidden">
//                 <div className="skeleton w-64 h-8"></div>
//                 <div className="skeleton w-48 h-6"></div>
//                 <div className="skeleton w-56 h-4"></div>
//             </div>

//             {/* Simple text-only version */}
//             <div className="mt-6 text-center text-sm text-gray-500">
//                 Please wait while we fetch your data...
//             </div>
//         </div>
//     );
// }
