import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactOnBlog } from "../services/reaction.api";
import { toggleLike } from "../services/reaction.api";

export const useBlogReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactOnBlog,

    onMutate: async ({ blogId, type }) => {
      // cancel ongoing fetches
      await queryClient.cancelQueries({ queryKey: ["blogs"] });

      // snapshot previous state
      const previousBlogs = queryClient.getQueriesData({
        queryKey: ["blogs"],
      });

      // optimistic update
      // previousBlogs.forEach(([queryKey, blogs]) => {
      //   if (!Array.isArray(blogs)) return;

      //   queryClient.setQueryData(queryKey, old => // old is old cached data for this query key
      //     old.map(blog => {
      //       if (blog._id !== blogId) return blog;

      //       const isSame = blog.myReaction === type;

      //       return {
      //         ...blog,
      //         myReaction: isSame ? null : type,
      //         likesCount: isSame
      //           ? blog.likesCount - 1
      //           : blog.likesCount + (blog.myReaction ? 0 : 1)
      //       };
      //     })
      //   );
      // });

      previousBlogs.forEach(([queryKey, oldData]) => {
        if (!oldData?.blogs) return;

        queryClient.setQueryData(queryKey, (old) => ({
          ...old,
          blogs: old.blogs.map((blog) => {
            if (blog._id !== blogId) return blog;

            // const isSame = blog.myReaction === type;
            const isSame = blog.myReaction == 'like';
            return {
              ...blog,
              myReaction: isSame ? null : type,
              likesCount: isSame
                ? blog.likesCount - 1
                : blog.likesCount + (blog.myReaction ? 0 : 1),
            };
          }),
        }));
      });

      return { previousBlogs };
    },

    onError: (_err, _vars, context) => {
      // rollback on failure
      context?.previousBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

// for single blogRead

export const useBlogReactionforBlogById = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike(blogId),

    onMutate: async () => {
      await queryClient.cancelQueries(["blogsById", blogId]);

      const previous = queryClient.getQueryData(["blogsById", blogId]);

      queryClient.setQueryData(["blogsById", blogId], old => ({
        ...old,
        isLiked: !old.isLiked,
        likesCount: old.isLiked
          ? old.likesCount - 1
          : old.likesCount + 1,
      }));

      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(["blogsById", blogId], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["blogsById", blogId]);
      queryClient.invalidateQueries(["blogsById"]);
    },
  });
};
