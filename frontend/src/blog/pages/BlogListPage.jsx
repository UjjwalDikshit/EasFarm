import React, { useState } from "react";
import BlogCard from "../components/list/BlogCard";
import BlogCardSkeleton from "../components/list/BlogCardSkeleton";
import { useBlogs } from "../hooks/useBlogs";

const BlogListPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: blogs,
    isLoading,
    isError,
  } = useBlogs({ page, limit: 6, search, status: "published" });

  const handleLike = (blogId) => {
    // delegate to reaction hook later
    console.log("like blog", blogId);
  };

  const handleCommentClick = (blogId) => {
    // open comment modal / drawer
    console.log("open comments for", blogId);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>

        <input
          type="text"
          placeholder="Search blogs..."
          className="input input-bordered w-full sm:max-w-xs"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-500">Failed to load blogs.</div>
      )}

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}

        {!isLoading &&
          blogs?.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onLike={handleLike}
              onCommentClick={handleCommentClick}
            />
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && blogs?.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No blogs found.</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          className="btn btn-outline btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default BlogListPage;
