import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Flag } from "lucide-react";

// Components & Utils
import Report from "../components/list/Report";
import BlogVideo from "../../utils/BlogVideo"; // Ensure this path is correct
import CommentItemUniqueBlog from "../components/comment/CommentItemUniqueBlog";
import createReport from "../services/report.api";

// Hooks
import { useBlogById } from "../hooks/useBlogs";
import { useToggleBlogLike } from "../hooks/useBlogReaction";
import { useComments, useAddComment } from "../hooks/useComment";

const BlogDetailPage = ({ currentUser }) => {
  const { blogId } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  /* ================= BLOG DATA ================= */
  const { data: blog, isLoading, isError } = useBlogById(blogId);
  const likeMutation = useToggleBlogLike(blogId);

  /* ================= COMMENTS DATA ================= */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(blogId);
  const addCommentMutation = useAddComment(blogId, currentUser);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">
          Loading blog...
        </p>
      </div>
    );
  }

  if (isError || !blog)
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Blog not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      {/* CATEGORY */}
      <p className="text-sm text-blue-500 uppercase bg">{blog.category}</p>

      {/* TITLE */}
      <h1 className="text-4xl italic font-serif text-white-900 border-l-4 border-indigo-500 pl-4">
        {blog.title}
      </h1>

      {/* AUTHOR + DATE */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>By {blog.authorId?.fullName}</span>{" "}
        <span>
          {new Date(blog.createdAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
        <button className="btn btn-sm " onClick={() => setOpenReport(true)}>
          <Flag /> Report
        </button>
        {openReport && (
          <dialog className="modal modal-open">
            <div className="modal-box relative">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setOpenReport(false)}
              >
                ✕
              </button>

              <Report
                blogId={blog._id}
                reportAboutThisBlog={(data) => {
                  createReport(data);
                  setOpenReport(false);
                }}
              />
            </div>
          </dialog>
        )}
      </div>

      {/* MEDIA */}
      {blog.mediaType === "image" && blog.media?.secureUrl && (
        <img
          src={blog.media.secureUrl}
          alt={blog.title}
          className="w-full rounded-xl"
        />
      )}

      {/* VIDEO PLAYER ADDED HERE */}
      {blog.mediaType === "video" && blog.media?.secureUrl && (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <BlogVideo url={blog.media.secureUrl} />
        </div>
      )}

      <div
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.content),
        }}
      />

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {blog.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* META */}
      <div className="flex items-center justify-between py-4 border-y">
        <div className="flex items-center gap-6 text-sm text-black-600">
          <span>Views : {blog.viewsCount}</span>
          <span>Reactions : {blog.likesCount}</span>
          <span>Responses : {blog.commentsCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => likeMutation.mutate()}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm
                  ${
                    blog.myReaction
                      ? "bg-red-50 text-red-600 shadow-red-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
          >
            <span className="text-lg">❤️</span>
            <span>{blog.myReaction ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span className="text-lg">💬</span>
            <span>Comment</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = e.target.comment.value;
              if (!text.trim()) return;
              addCommentMutation.mutate(text);
              e.target.reset();
            }}
            className="flex gap-2"
          >
            <input
              name="comment"
              placeholder="Write a comment..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="px-4 py-2 bg-black text-white rounded-full">
              Post
            </button>
          </form>

          {data?.pages.map((page) =>
            page.data.comments.map((comment) => (
              <CommentItemUniqueBlog
                key={comment._id}
                comment={comment}
                blogId={blogId}
                currentUser={currentUser}
              />
            )),
          )}
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
