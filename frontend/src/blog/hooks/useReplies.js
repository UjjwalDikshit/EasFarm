import { useInfiniteQuery } from "@tanstack/react-query";
import commentAPI from "../api/commentAPI";

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
