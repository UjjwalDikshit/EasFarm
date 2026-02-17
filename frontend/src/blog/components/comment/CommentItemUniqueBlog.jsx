

import { useState } from "react";
import { useReplyComment } from "../../hooks/useComment";

const CommentItemUniqueBlog = ({
  comment,
  blogId,
  currentUser,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const replyMutation = useReplyComment(blogId, currentUser);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    replyMutation.mutate({
      commentId: comment._id, // always reply to main comment
      content: replyText,
    });

    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="space-y-4 border-b pb-6">
      {/* MAIN COMMENT */}
      <div className="bg-gray-900 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm text-white">
            {comment.user?.fullName || "User"}
          </p>

          {comment.isPending && (
            <span className="text-xs text-gray-400">
              Sending...
            </span>
          )}
        </div>

        <p className="text-sm text-gray-200 mt-2">
          {comment.content}
        </p>

        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <button
            onClick={() => setShowReplyInput((prev) => !prev)}
            className="hover:text-white transition"
          >
            Reply
          </button>

          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="hover:text-white transition"
            >
              {showReplies
                ? "Hide replies"
                : `Show replies (${comment.replies.length})`}
            </button>
          )}
        </div>
      </div>

      {/* REPLY INPUT */}
      {showReplyInput && (
        <form onSubmit={handleReply} className="flex gap-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="px-4 py-2 bg-black text-white rounded-full text-sm">
            Post
          </button>
        </form>
      )}

      {/* REPLIES (ONLY ONE LEVEL) */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <div
              key={reply._id}
              className="bg-gray-800 rounded-lg p-3"
            >
              <p className="text-sm font-medium text-white">
                {reply.user?.fullName || "User"}
              </p>

              <p className="text-sm text-gray-300 mt-1">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItemUniqueBlog;
