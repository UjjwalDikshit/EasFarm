import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactOnBlog } from "../services/reaction.api";

export const useBlogReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactOnBlog,

    onMutate: async ({ blogId, type }) => {
      // cancel ongoing fetches
      await queryClient.cancelQueries({ queryKey: ["blogs"] });

      // snapshot previous state
      const previousBlogs = queryClient.getQueriesData({
        queryKey: ["blogs"]
      });

      // optimistic update
      previousBlogs.forEach(([queryKey, blogs]) => {
        if (!Array.isArray(blogs)) return;

        queryClient.setQueryData(queryKey, old => // old is old cached data for this query key
          old.map(blog => {
            if (blog._id !== blogId) return blog;

            const isSame = blog.myReaction === type;

            return {
              ...blog,
              myReaction: isSame ? null : type,
              likesCount: isSame
                ? blog.likesCount - 1
                : blog.likesCount + (blog.myReaction ? 0 : 1)
            };
          })
        );
      });

      return { previousBlogs };
    },

    onError: (_err, _vars, context) => {
      // rollback on failure
      context?.previousBlogs?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    }
  });
};
