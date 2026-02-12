import { useInfiniteQuery } from "@tanstack/react-query";
import * as commentAPI from "../services/comment.api";

export const useReplies = (commentId) => {
  return useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam = 1 }) =>
      commentAPI.getReplies(commentId, pageParam),

    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.nextPage
        : undefined;
    },

    enabled: !!commentId, // only run if commentId exists
  });
};
