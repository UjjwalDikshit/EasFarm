// import React from "react";
// import ReactPlayer from "react-player";

// const BlogVideo = ({ url }) => {
//   // Guard clause to prevent crashing if url is missing
//   if (!url) {
//     return (
//       <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
//         <p className="text-gray-500">Video unavailable</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full aspect-video bg-black overflow-hidden relative">
//       <ReactPlayer
//         url={url}
//         controls={true}
//         width="100%"
//         height="100%"
//         pip={true}
//         stopOnUnmount={false}
//         // playsinline is critical for iOS/Safari support
//         config={{
//           file: {
//             attributes: {
//               playsInline: true,
//               controlsList: 'nodownload' // Optional: prevents download button
//             }
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default BlogVideo;
import React from 'react';

const BlogVideo = ({ url }) => {
  if (!url) return null;

  return (
    <video 
      controls 
      className="w-full h-full object-cover"
      // Necessary for mobile/safari sometimes:
      playsInline 
      preload="metadata"
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BlogVideo;