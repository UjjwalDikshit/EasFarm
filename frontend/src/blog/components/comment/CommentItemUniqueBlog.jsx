import { useState } from "react";
import { useReplyComment } from "../../hooks/useComment";

const CommentItemUniqueBlog = ({ comment, blogId, currentUser }) => {
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
    <div className="space-y-4 border-b border-base-300 pb-6">
      {/* MAIN COMMENT */}
      <div className="bg-base-200 rounded-xl p-4 shadow-sm transition hover:shadow-md">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm text-base-content">
            {comment.user?.fullName || "User"}
          </p>

          {comment.isPending && (
            <span className="text-xs text-base-content/60">Sending...</span>
          )}
        </div>

        <p className="text-sm text-base-content/80 mt-2 leading-relaxed">
          {comment.content}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-3 text-xs text-base-content/60">
          <button
            onClick={() => setShowReplyInput((prev) => !prev)}
            className="hover:text-primary transition font-medium"
          >
            Reply
          </button>

          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="hover:text-primary transition font-medium"
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
        <form onSubmit={handleReply} className="flex gap-2 items-center">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 input input-bordered rounded-full text-sm"
          />

          <button className="btn btn-primary btn-sm rounded-full px-5">
            Post
          </button>
        </form>
      )}

      {/* REPLIES */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="bg-base-300 rounded-lg p-3">
              <p className="text-sm font-medium text-base-content">
                {reply.user?.fullName || "User"}
              </p>

              <p className="text-sm text-base-content/70 mt-1">
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
