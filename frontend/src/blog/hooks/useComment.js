import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentAPI from "../services/comment.api";
import { AddComment } from "../services/comment.api";

/* ===========================
   GET COMMENTS (INFINITE)
=========================== */

export const useComments = (blogId) => {
  return useInfiniteQuery({
    queryKey: ["comments", blogId],
    queryFn: ({ pageParam = 1 }) =>
      commentAPI.getComments(blogId, pageParam, 5),

    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.data;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },

    enabled: !!blogId
  });
};


/* ===========================
   REPLY TO COMMENT
=========================== */

export const useReplyComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentAPI.replyComment(commentId, content),

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
              comments: page.data.comments.map(comment => {
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

    onError: (_, __, context) => {
      queryClient.setQueryData(["comments", blogId], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    }
  });
};


/* ===========================
   ADD NEW COMMENT
=========================== */

export const useAddComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) =>
      commentAPI.addComment(blogId, content),

    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["comments", blogId] });

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
                comments: [
                  {
                    _id: Date.now(),
                    content,
                    replies: [],
                    isPending: true
                  },
                  ...firstPage.data.comments
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
      queryClient.setQueryData(["comments", blogId], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    }
  });
};

//for blogById -> detail page
export const useCommentsForBlogById = (blogId, currentUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text) => AddComment({ blogId, text }),

    onMutate: async (text) => {
      await queryClient.cancelQueries(["blogsById", blogId]);

      const previous = queryClient.getQueryData(["blogsById", blogId]);

      queryClient.setQueryData(["blogsById", blogId], old => ({
        ...old,
        comments: [
          ...old.comments,
          {
            id: Date.now(),
            text,
            user: currentUser,
            optimistic: true,
          }
        ],
      }));

      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(["blogsById", blogId], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["blogsById", blogId]);
    },
  });
};
