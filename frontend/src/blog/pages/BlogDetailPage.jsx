import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";

const fetchBlogById = async (blogId) => {
  const res = await axiosClient.get(`/blogs/${blogId}`);
  return res.data;
};

function BlogDetailPage() {
  const { blogId } = useParams();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => fetchBlogById(blogId),
    enabled: !!blogId,
  });

  if (isLoading) return <p>Loading blog...</p>;
  if (isError) return <p>Failed to load blog</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      <div className="text-sm text-gray-500 mt-2">
        {blog.author?.name} · {new Date(blog.createdAt).toDateString()}
      </div>

      <article className="mt-6 prose">
        {blog.content}
      </article>

      {/* reactions */}
      {/* comments */}
    </div>
  );
}

export default BlogDetailPage;
