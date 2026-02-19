import { useParams } from "react-router-dom";
import { useState } from "react";
import Report from "../components/list/Report";
import createReport from "../services/report.api";
import DOMPurify from "dompurify";
import { Flag } from "lucide-react";
import { useBlogById } from "../hooks/useBlogs";
import { useToggleBlogLike } from "../hooks/useBlogReaction";
import CommentItemUniqueBlog from "../components/comment/CommentItemUniqueBlog";

import {
  useComments,
  useAddComment,
  useReplyComment,
} from "../hooks/useComment";


const BlogDetailPage = ({ currentUser }) => {
  const { blogId } = useParams();

  /* ================= BLOG ================= */

  const { data: blog, isLoading, isError } = useBlogById(blogId);

  const likeMutation = useToggleBlogLike(blogId);

  /* ================= COMMENTS ================= */

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(blogId);

  const addCommentMutation = useAddComment(blogId, currentUser);

  const [showComments, setShowComments] = useState(false);

  const [commentText, setCommentText] = useState("");

  // report handling
  const [openReport, setOpenReport] = useState(false);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">
          Loading blog...
        </p>
      </div>
    );

  if (isError || !blog) return <p>Blog not found</p>;


  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addCommentMutation.mutate(commentText);
    setCommentText("");
  };

  /* ================= RENDER ================= */

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
        {/* later can add image link + name */}
        <span>
          {
            new Date(blog.createdAt).toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            // .replace(",", "")
          }
        </span>
        {/* change updated -> published at */}
        <button className="btn btn-sm " onClick={() => setOpenReport(true)}>
          <Flag /> Report
        </button>
        {openReport && (
          <dialog className="modal modal-open">
            <div className="modal-box relative">
              {/* Close Button */}
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setOpenReport(false)}
              >
                ✕
              </button>

              <Report
                blogId={blog._id}
                reportAboutThisBlog={(data) => {
                  createReport(data); // call API
                  setOpenReport(false); // close popup
                }}
              />
            </div>
          </dialog>
        )}
       
      </div>

      {/* MEDIA */}
      {blog.mediaType == "image" && (
        <img
          src={blog.media.secureUrl}
          alt={blog.title}
          className="w-full rounded-xl"
        />
      )}

      {blog.videoUrl && (
        // <video src={blog.videoUrl} controls className="w-full rounded-xl" />
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/LBCZaNd1rkM"
          title="Vedic Guided Meditation"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full object-cover"
        ></iframe>
      )}

      {/* set for presenting content in formated form, store html at backend? there are better later i will try definitly, like editorJs , reactMarkDown*/}
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
        {/* LEFT SIDE - COUNTS */}
        <div className="flex items-center gap-6 text-sm text-black-600">
          <span>Views : {blog.viewsCount}</span>
          <span>Reactions : {blog.likesCount}</span>
          <span>Responses : {blog.commentsCount}</span>
        </div>

        {/* RIGHT SIDE - ACTIONS */}
        <div className="flex items-center gap-3">
          {/* LIKE BUTTON */}
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

          {/* COMMENT BUTTON */}
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
