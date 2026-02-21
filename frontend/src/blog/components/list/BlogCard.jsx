import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";

const BlogCard = ({ blog, onReaction, onCommentClick, isCommentOpen }) => {
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
    myReaction,
    mediaType,
    media
  } = blog;

  const isLiked = myReaction == "like";
  const navigate = useNavigate();

  return (
    <article
      className="card bg-base-100 shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/blog/${_id}`)}
    >
      {/* Media */}
      { mediaType && (//(coverImage || videoUrl)
        <figure className="max-h-64 overflow-hidden">
          {mediaType == 'image' ? (
            <img src={ media.secureUrl } alt={title} className="w-full object-cover" />
          ) : (
            // <video src={media.secureUrl} controls className="w-full object-cover" />
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/LBCZaNd1rkM"
              title="Vedic Guided Meditation"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full object-cover"
              >
            </iframe>

          )}
        </figure>
      )}

      <div className="card-body">
        {/* Title */}
         <Link to={`/blog/${_id}`} onClick={(e) => e.stopPropagation()}>  {/*can redirect to slug */}
          <h2 className="card-title line-clamp-2 hover:underline">{title}</h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3">{content}</p>

        {/* Meta */}
        <div className="text-xs text-gray-400 mt-1">
          {publishedAt ? new Date(publishedAt).toLocaleDateString() : "Draft"}
        </div>

        {/* Actions */}
        <div className="card-actions justify-between mt-4">
          {/* LIKE */}
          <button
            className={`btn btn-ghost btn-sm gap-1 ${
              isLiked ? "text-red-500" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onReaction(_id, "like");
            }}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
          </button>

          {/* COMMENT */}
          <button
            className="btn btn-ghost btn-sm gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick(_id);
            }}
          >
            <MessageCircle size={16} />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* COMMENT SECTION */}
        {isCommentOpen && (
          <div
            className="border-t pt-4 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CommentForm blogId={_id} />
            <CommentList blogId={_id} />
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;
