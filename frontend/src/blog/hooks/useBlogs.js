import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/blog.api";

export const useBlogs = ({
  page = 1,
  limit = 6,
  search = "",
  status = "published",
  category,
  tags,
}) => {
  return useQuery({
    queryKey: ["blogs", { page, limit, search, status, category, tags }],
    queryFn: async () => {
      const res = await fetchBlogs({
        page,
        limit,
        search,
        status,
        category,
        tags,
      });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
