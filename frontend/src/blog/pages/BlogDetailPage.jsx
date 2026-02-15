import { useParams } from "react-router-dom";
import { useBlogById, useBlogBySlug } from "../hooks/useBlogs";
import { useBlogReactionforBlogById } from "../hooks/useBlogReaction";
import { useCommentsForBlogById } from "../hooks/useComment";
import DOMPurify from "dompurify";

const BlogDetailPage = () => {
  //   const { slug } = useParams();
  const { blogId } = useParams();

  const { data: blog, isLoading, isError } = useBlogById(blogId);

  const likeMutation = useBlogReactionforBlogById(blog?._id);
  const commentMutation = useCommentsForBlogById(blog?._id);

    if (isLoading)
    return (
        <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">
            Loading blog...
        </p>
        </div>
    );

  
  console.log(blog);
  if (isError || !blog) return <p>Blog not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      {/* CATEGORY */}
      <p className="text-sm text-blue-500 uppercase bg">{blog.category}</p>

      {/* TITLE */}
    <h1 className="text-4xl italic font-serif text-white-900 border-l-4 border-indigo-500 pl-4">
        {blog.title}
    </h1>


      {/* AUTHOR + DATE */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>By {blog.authorId?.fullName}</span>{" "}
        {/* later can add image link + name */}
        <span>
          {new Date(blog.createdAt)
            .toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            // .replace(",", "")
            }
        </span>
        {/* change updated -> published at */}
      </div>

      {/* MEDIA */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full rounded-xl"
        />
      )}

      {blog.videoUrl && (
        // <video src={blog.videoUrl} controls className="w-full rounded-xl" />
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/LBCZaNd1rkM"
          title="Vedic Guided Meditation"
          FrameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full object-cover"
        ></iframe>
      )}

      {/* CONTENT
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      /> */}

      {/* set for presenting content in formated form, store html at backend? there are better later i will try definitly, like editorJs , reactMarkDown*/}
      <div
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.content),
        }}
      />

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {blog.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* META */}
      <div className="flex gap-6 text-sm text-gray-600">
        <span>Views {blog.viewsCount}</span>
        <button
          onClick={() => likeMutation.mutate()}
          className="flex items-center gap-1"
        >
          Reactions: {blog.likesCount}
        </button>
        <span>Responses: {blog.commentsCount}</span>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4">
        {blog.comments?.map((comment) => (
          <div key={comment._id} className="border-b pb-2">
            <p className="font-medium">{comment.user?.name}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* ADD COMMENT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.target.comment.value;
          commentMutation.mutate(text);
          e.target.reset();
        }}
      >
        <input
          name="comment"
          placeholder="Write a comment..."
          className="border p-3 w-full rounded-lg"
        />
      </form>
    </div>
  );
};

export default BlogDetailPage;
