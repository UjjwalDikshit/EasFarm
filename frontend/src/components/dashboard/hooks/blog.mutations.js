import { useInfiniteQuery ,useMutation, useQueryClient} from "@tanstack/react-query";
import * as myBlogApi from "../api/blog.api";



export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: myBlogApi.createBlog,

    onMutate: async (newBlog) => {
      await queryClient.cancelQueries({ queryKey: ["myBlogs"] });

      const previousData = queryClient.getQueryData(["myBlogs"]);

      queryClient.setQueryData(["myBlogs"], (old) => {
        if (!old) return old;

        const firstPage = old.pages[0];

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: [
                {
                  ...newBlog,
                  _id: "temp-id",
                  isOptimistic: true,
                },
                ...firstPage.data,
              ],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousData };
    },

    onError: (err, newBlog, context) => {
      queryClient.setQueryData(["myBlogs"], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: myBlogApi.deleteBlog,

    onMutate: async (blogId) => {
      await queryClient.cancelQueries({ queryKey: ["myBlogs"] });

      const previousData = queryClient.getQueryData(["myBlogs"]);

      queryClient.setQueryData(["myBlogs"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((blog) => blog._id !== blogId),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, blogId, context) => {
      queryClient.setQueryData(["myBlogs"], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};


export const useChangeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      myBlogApi.changeStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["myBlogs"] });

      const previousData = queryClient.getQueryData(["myBlogs"]);

      queryClient.setQueryData(["myBlogs"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((blog) =>
              blog._id === id
                ? { ...blog, status }
                : blog
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["myBlogs"], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};


export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogId, formData }) => {
      const res = await myBlogApi.updateBlog(blogId, formData);
      return res.data.data; // 👈 return updated blog
    },

    // 🔥 Optimistic Update
    onMutate: async ({ blogId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["myBlogs"] });

      const previousData = queryClient.getQueryData(["myBlogs"]);

      queryClient.setQueryData(["myBlogs"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((blog) =>
              blog._id === blogId
                ? {
                    ...blog,
                    ...formData,
                    isOptimistic: true,
                  }
                : blog
            ),
          })),
        };
      });

      return { previousData };
    },

    // ❌ Rollback if error
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["myBlogs"],
          context.previousData
        );
      }
    },

    // ✅ Replace with actual backend response
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["myBlogs"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((blog) =>
              blog._id === updatedBlog._id
                ? updatedBlog
                : blog
            ),
          })),
        };
      });
    },
  });
};
