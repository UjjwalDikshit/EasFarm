import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";
import ReplyList from "./ReplyList";

const CommentItem = ({ comment, blogId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { _id, content, author, createdAt, repliesCount = 0 } = comment;

  return (
    <div className="space-y-2">
      {/* Main Comment */}
      <div className="bg-base-200 p-3 rounded-lg">
        <div className="text-sm font-medium">{author?.name || "User"}</div>

        <div className="text-sm mt-1">{content}</div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>{createdAt && new Date(createdAt).toLocaleString()}</span>

          {/* Reply Button */}
          <button
            className="flex items-center gap-1 hover:text-primary"
            onClick={() => setShowReplyForm((prev) => !prev)}
          >
            <MessageCircle size={14} />
            Reply
          </button>

          {/* View Replies Button */}
          {repliesCount > 0 && (
            <button
              className="hover:text-primary"
              onClick={() => setShowReplies((prev) => !prev)}
            >
              {showReplies ? "Hide Replies" : `View Replies (${repliesCount})`}
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-6">
          <CommentForm
            blogId={blogId}
            parentId={_id}
            isReply
            onClose={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Lazy Loaded Replies */}
      {showReplies && (
        <div className="ml-6 border-l pl-4">
          <ReplyList commentId={_id} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
