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


export const useToggleBlogLike = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike(blogId),

    /* 🔥 Optimistic Update */
    onMutate: async () => {
      await queryClient.cancelQueries(["blog", blogId]);

      const previous = queryClient.getQueryData(["blog", blogId]);

      queryClient.setQueryData(["blog", blogId], (old) => {
        if (!old) return old;

        const alreadyLiked = old.myReaction;

        return {
          ...old,
          myReaction: !alreadyLiked,
          likesCount: alreadyLiked
            ? old.likesCount - 1
            : old.likesCount + 1,
        };
      });

      return { previous };
    },

    /* ❌ If backend fails, rollback */
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["blog", blogId],
          context.previous
        );
      }
    },

    /* 🔄 Always revalidate */
    onSettled: () => {
      queryClient.invalidateQueries(["blog", blogId]);
      queryClient.invalidateQueries(["blogs"]);
    },
  });
};