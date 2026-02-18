import { useInfiniteQuery } from "@tanstack/react-query";
import * as myBlogApi from "../api/blog.api";

export const useMyBlogsInfinite = ({ limit = 6, enabled }) => {
  return useInfiniteQuery({
    queryKey: ["myBlogs"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await myBlogApi.getMyBlogs({
        page: pageParam,
        limit,
      });

      return res.data;
    },

    getNextPageParam: (lastPage, pages) => {
      const { page, totalPages } = lastPage.pagination;

      if (page < totalPages) {
        return page + 1;
      }

      return undefined;
    },

    enabled, // 👈 important (tab control)
    staleTime: 5 * 60 * 1000,
  });
};
