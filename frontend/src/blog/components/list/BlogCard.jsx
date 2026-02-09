import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

const BlogCard = ({ blog, onReaction, onCommentClick }) => {
  const {
    _id,
    title,
    content,
    coverImage,
    videoUrl,
    slug,
    likesCount,
    commentsCount,
    publishedAt,
    myReaction
  } = blog;

  const isLiked = myReaction === "like";

  return (
    <article className="card bg-base-100 shadow-md hover:shadow-lg transition">
      {/* Media */}
      {(coverImage || videoUrl) && (
        <figure className="max-h-64 overflow-hidden">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full object-cover" />
          ) : (
            <video src={videoUrl} controls className="w-full object-cover" />
          )}
        </figure>
      )}

      <div className="card-body">
        {/* Title */}
        <Link to={`/blogs/${slug}`}>
          <h2 className="card-title line-clamp-2 hover:underline">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {content}
        </p>

        {/* Meta */}
        <div className="text-xs text-gray-400 mt-1">
          {publishedAt
            ? new Date(publishedAt).toLocaleDateString()
            : "Draft"}
        </div>

        {/* Actions */}
        <div className="card-actions justify-between mt-4">
          {/* LIKE */}
          <button
            className={`btn btn-ghost btn-sm gap-1 ${
              isLiked ? "text-red-500" : ""
            }`}
            onClick={() => onReaction(_id, "like")}
          >
            <Heart
              size={16}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span>{likesCount}</span>
          </button>

          {/* COMMENT */}
          <button
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => onCommentClick(_id)}
          >
            <MessageCircle size={16} />
            <span>{commentsCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
