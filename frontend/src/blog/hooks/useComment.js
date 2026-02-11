import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentAPI from "../services/comment.api";

export const useComments = (blogId) => {
  return useInfiniteQuery({
    queryKey: ["comments", blogId],
    queryFn: ({ pageParam = 1 }) =>
      commentAPI.getComments(blogId, pageParam, 5),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.data.meta.page < lastPage.data.meta.totalPages;
      return hasMore ? lastPage.data.meta.page + 1 : undefined;
    },
    enabled: !!blogId
  });
};


export const useReplyComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentAPI.replyComment(commentId, content),

    // 1 OPTIMISTIC UPDATE
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", blogId] });

      const previous = queryClient.getQueryData(["comments", blogId]);

      queryClient.setQueryData(["comments", blogId], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map(comment => {
                if (comment._id !== commentId) return comment;

                return {
                  ...comment,
                  replies: [
                    {
                      _id: Date.now(),
                      content,
                      isPending: true
                    },
                    ...(comment.replies || [])
                  ]
                };
              })
            }
          }))
        };
      });

      return { previous };
    },

    // 2 ROLLBACK IF ERROR
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["comments", blogId],
        context.previous
      );
    },

    // 3 REFRESH AFTER SUCCESS
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId]
      });
    }
  });
};



export const useAddComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) =>
      commentAPI.addComment(blogId, content),

    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments", blogId]);

      const previous = queryClient.getQueryData(["comments", blogId]);

      queryClient.setQueryData(["comments", blogId], (old) => {
        if (!old) return old;

        const firstPage = old.pages[0];

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: {
                ...firstPage.data,
                data: [
                  {
                    _id: Date.now(),
                    content: newComment,
                    isPending: true
                  },
                  ...firstPage.data.data
                ]
              }
            },
            ...old.pages.slice(1)
          ]
        };
      });

      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["comments", blogId],
        context.previous
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["comments", blogId]);
    }
  });
};
