import React from "react";

const BlogCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-md animate-pulse">
      {/* Media */}
      <figure className="h-48 bg-gray-200" />

      <div className="card-body">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />

        {/* Excerpt */}
        <div className="space-y-2 mt-3">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Meta */}
        <div className="h-3 bg-gray-200 rounded w-24 mt-4" />

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
