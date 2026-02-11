import { useComments } from "../../hooks/useComment";
import CommentItem from './CommentItem'
import { useEffect, useRef } from "react";

const CommentList = ({ blogId }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(blogId);

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
    <div className="mt-4 space-y-4">
      {data?.pages.map((page) =>
        page.data.data.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))
      )}

      <div ref={observerRef} />

      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default CommentList;
