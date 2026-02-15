import React, { useState } from "react";
import BlogCard from "../components/list/BlogCard";
import BlogCardSkeleton from "../components/list/BlogCardSkeleton";
import { useBlogs } from "../hooks/useBlogs";
import { useBlogReaction } from "../hooks/useBlogReaction";

const BlogListPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openCommentBlogId, setOpenCommentBlogId] = useState(null);

  const { mutate: reactToBlog } = useBlogReaction();

  const {
    data,
    isLoading,
    isError,
  } = useBlogs({ page, limit: 20, search, status: "published" });

  const handleReaction = (blogId) => {
    reactToBlog({
      blogId,
      type: "like",
    });
  };

  const handleCommentClick = (blogId) => {
    setOpenCommentBlogId((prev) => (prev === blogId ? null : blogId));
  };

  const blogs = data?.blogs || []; // ✅ FIX

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
      <div > {/*className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}

        {!isLoading &&
          blogs.map((blog) => (  // ✅ FIX
            <div key={blog._id}>
              <BlogCard
                blog={blog}
                onReaction={handleReaction}
                onCommentClick={handleCommentClick}
                isCommentOpen={openCommentBlogId === blog._id}
              />
            </div>
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && blogs.length === 0 && (  // ✅ FIX
        <div className="text-center text-gray-500 mt-10">
          No blogs found.
        </div>
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
