import { useReplies } from "../../hooks/useReplies";
import { useEffect, useRef } from "react";

const ReplyList = ({ commentId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReplies(commentId);

  const observerRef = useRef();

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchNextPage();
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="ml-6 mt-3 space-y-2">
      {data?.pages.map((page) =>
        page.data.data.map((reply) => (
          <div key={reply._id} className="text-sm border-l pl-3">
            {reply.content}
          </div>
        ))
      )}

      <div ref={observerRef} />

      {isFetchingNextPage && <p>Loading more replies...</p>}
    </div>
  );
};

export default ReplyList;
