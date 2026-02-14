import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, blogId , nowNoReply = "true" }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { _id, content, userId, createdAt, replies = [] } = comment;

  return (
    <div className="space-y-2">
      <div className="bg-base-200 p-3 rounded-lg">
        <div className="text-sm font-medium">{userId?.name || "User"}</div>

        <div className="text-sm mt-1">{content}</div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>{createdAt && new Date(createdAt).toLocaleString()}</span>

          {nowNoReply !== "false" && (
            <button
              className="flex items-center gap-1 hover:text-primary"
              onClick={() => setShowReplyForm((prev) => !prev)}
            >
              <MessageCircle size={14} />
              Reply
            </button>
          )}

           

          {replies.length > 0 && (
            <button
              className="hover:text-primary"
              onClick={() => setShowReplies((prev) => !prev)}
            >
              {showReplies
                ? "Hide Replies"
                : `View Replies (${replies.length})`}
            </button>
          )}
        </div>
      </div>

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

      {showReplies && replies.length > 0 && (
        <div className="ml-6 border-l pl-4">
          {replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} blogId={blogId} nowNoReply={"false"}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
