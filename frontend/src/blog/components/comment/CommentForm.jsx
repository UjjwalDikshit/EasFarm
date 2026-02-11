import { useState } from "react";
import {
  useAddComment,
  useReplyComment,
} from "../../hooks/useComment";

const CommentForm = ({
  blogId,
  parentId,
  isReply = false,
  onClose, // not defined onClose yet
}) => {
  const [content, setContent] = useState("");

  const { mutate: addComment } = useAddComment(blogId);
  const { mutate: replyComment } = useReplyComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (isReply) {
      replyComment({ commentId: parentId, content });
    } else {
      addComment(content);
    }

    setContent("");
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          isReply ? "Write a reply..." : "Write a comment..."
        }
        className="input input-bordered w-full input-sm"
      />
      <button className="btn btn-primary btn-sm">
        Post
      </button>
    </form>
  );
};

export default CommentForm;
