import { useEffect, useRef } from "react";
import { useMyBlogsInfinite } from "../hooks/blog.queries";
import {
  useDeleteBlog,
  useUpdateBlog,
  useChangeStatus,
} from "../hooks/blog.mutations";
import MyBlogCard from "./MyBlogCard";

export default function BlogPrintSection({ enabled }) {
  const observerRef = useRef();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyBlogsInfinite({
      limit: 10,
      enabled,
    });

  const { mutate: updateBlog } = useUpdateBlog();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: changeStatus } = useChangeStatus();

  const blogs = data?.pages.flatMap((page) => page.data) ?? [];

  // Infinite scroll
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <MyBlogCard
          key={blog._id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          changeStatus={changeStatus}
        />
      ))}

      {hasNextPage && (
        <div ref={observerRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </div>
      )}
      {/* No Blogs At All */}
      {blogs.length === 0 && !hasNextPage && (
        <div className="text-center py-6 text-gray-500">You have no Blogs</div>
      )}

      {/* No More Blogs */}
      {blogs.length > 0 && !hasNextPage && (
        <div className="text-center py-6 text-gray-400">No more Blogs</div>
      )}
    </div>
  );
}
