import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import BlogVideo from "../../../utils/BlogVideo";

const BlogCard = ({
  blog,
  onReaction,
  onCommentClick,
  isCommentOpen,
}) => {
  const {
    _id,
    title,
    content,
    likesCount,
    commentsCount,
    publishedAt,
    myReaction,
    mediaType,
    media,
  } = blog;

  const navigate = useNavigate();
  const isLiked = myReaction === "like";

  // Helper to handle navigation to detail page
  const handleCardClick = () => {
    navigate(`/blog/${_id}`);
  };

  return (
    <article
      className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border border-base-200"
      onClick={handleCardClick}
    >
      {/* MEDIA SECTION */}
      {media?.secureUrl && (
        <figure className="aspect-video w-full overflow-hidden bg-gray-100">
          {mediaType === "image" ? (
            <img
              src={media.secureUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : mediaType === "video" ? (
            <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
              <BlogVideo url={media.secureUrl} />
            </div>
          ) : null}
        </figure>
      )}

      <div className="card-body p-5">
        {/* TITLE */}
        <Link
          to={`/blog/${_id}`}
          className="hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="card-title text-xl font-bold line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* CONTENT PREVIEW */}
        <p className="text-sm text-gray-600 line-clamp-3 mt-2">
          {content}
        </p>

        {/* METADATA */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
          <span>
            {publishedAt
              ? new Date(publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : "Draft"}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
          <div className="flex gap-2">
            {/* LIKE BUTTON */}
            <button
              className={`btn btn-ghost btn-sm gap-2 normal-case ${
                isLiked ? "text-error bg-error/10" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onReaction(_id, "like");
              }}
            >
              <Heart
                size={18}
                fill={isLiked ? "currentColor" : "none"}
              />
              <span className="font-medium">{likesCount || 0}</span>
            </button>

            {/* COMMENT TOGGLE BUTTON */}
            <button
              className={`btn btn-ghost btn-sm gap-2 normal-case ${
                isCommentOpen ? "bg-base-200" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onCommentClick(_id);
              }}
            >
              <MessageCircle size={18} />
              <span className="font-medium">{commentsCount || 0}</span>
            </button>
          </div>
        </div>

        {/* EXPANDABLE COMMENTS SECTION */}
        {isCommentOpen && (
          <div
            className="mt-4 pt-4 border-t border-base-200 animate-in fade-in slide-in-from-top-2"
            onClick={(e) => e.stopPropagation()}
          >
            <CommentForm blogId={_id} />
            <div className="mt-4 max-h-60 overflow-y-auto">
              <CommentList blogId={_id} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

// Use memo to prevent re-renders unless props change
export default memo(BlogCard);