import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentAPI from "../services/comment.api";
// import { AddComment } from "../services/comment.api";

// /* ===========================
//    GET COMMENTS (INFINITE)
// =========================== */

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


// /* ===========================
//    REPLY TO COMMENT
// =========================== */

// export const useReplyComment = (blogId, currentUser) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ commentId, content }) =>
//       commentAPI.replyComment(commentId, content),

//     onMutate: async ({ commentId, content }) => {
//       await queryClient.cancelQueries({ queryKey: ["comments", blogId] });

//       const previous = queryClient.getQueryData(["comments", blogId]);

//       queryClient.setQueryData(["comments", blogId], (old) => {
//         if (!old) return old;

//         return {
//           ...old,
//           pages: old.pages.map(page => ({
//             ...page,
//             data: {
//               ...page.data,
//               comments: page.data.comments.map(comment => {
//                 if (comment._id !== commentId) return comment;

//                 return {
//                   ...comment,
//                   replies: [
//                     {
//                       _id: `temp-${Date.now()}`,
//                       content,
//                       isPending: true
//                     },
//                     ...(comment.replies || [])
//                   ]
//                 };
//               })
//             }
//           }))
//         };
//       });

//       return { previous };
//     },

//     onError: (_, __, context) => {
//       queryClient.setQueryData(["comments", blogId], context.previous);
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
//     }
//   });
// };



/* =========================================================
   HELPER — Recursive Reply Injection
========================================================= */

const addReplyRecursively = (comments, commentId, newReply) => {
  return comments.map((comment) => {
    if (comment._id === commentId) {
      return {
        ...comment,
        replies: [newReply, ...(comment.replies || [])],
      };
    }

    if (comment.replies?.length) {
      return {
        ...comment,
        replies: addReplyRecursively(
          comment.replies,
          commentId,
          newReply
        ),
      };
    }

    return comment;
  });
};

/* =========================================================
   ADD NEW ROOT COMMENT
========================================================= */

export const useAddComment = (blogId, currentUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) =>
      commentAPI.addComment(blogId, content),

    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", blogId],
      });

      const previous = queryClient.getQueryData([
        "comments",
        blogId,
      ]);

      queryClient.setQueryData(["comments", blogId], (old) => {
        if (!old) return old;

        const optimisticComment = {
          _id: `temp-${Date.now()}`,
          content,
          user: currentUser,
          createdAt: new Date().toISOString(),
          replies: [],
          isPending: true,
        };

        const firstPage = old.pages[0];

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: {
                ...firstPage.data,
                comments: [
                  optimisticComment,
                  ...firstPage.data.comments,
                ],
              },
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["comments", blogId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });

      // update comment count in blog detail
      queryClient.invalidateQueries({
        queryKey: ["blog", blogId],
      });
    },
  });
};

/* =========================================================
   REPLY TO ANY COMMENT (Unlimited Depth)
========================================================= */

export const useReplyComment = (blogId, currentUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentAPI.replyComment(commentId, content),

    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", blogId],
      });

      const previous = queryClient.getQueryData([
        "comments",
        blogId,
      ]);

      queryClient.setQueryData(["comments", blogId], (old) => {
        if (!old) return old;

        const optimisticReply = {
          _id: `temp-${Date.now()}`,
          content,
          user: currentUser,
          createdAt: new Date().toISOString(),
          replies: [],
          isPending: true,
        };

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              comments: addReplyRecursively(
                page.data.comments,
                commentId,
                optimisticReply
              ),
            },
          })),
        };
      });

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["comments", blogId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
    },
  });
};
