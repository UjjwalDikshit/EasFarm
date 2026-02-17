import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs } from "../services/blog.api";
import { getBlogById , getBlogBySlug} from "../services/blog.api";

// key : blogs
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



// key: blog
export const useBlogById = (blogId) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlogById(blogId),
    enabled: !!blogId,
    staleTime: 1000 * 60 * 5,

    initialData: () => {
      const cachedLists = queryClient.getQueriesData({ queryKey: ["blogs"] }); 

      for (const [, data] of cachedLists) {
        const found = data?.data?.find(b => b._id === blogId);
        if (found) return found;
      }

      return undefined;
    },
  });
};



export const useBlogBySlug = (slug) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["useBlogBySlug", slug],
    queryFn: () => getBlogBySlug(slug),
    initialData: () => {
      const cachedLists = queryClient.getQueriesData({ queryKey: ["useBlogBySlug"] });

      for (const [, data] of cachedLists) {
        const found = data?.data?.find(b => b.id === blogId);
        if (found) return found;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
