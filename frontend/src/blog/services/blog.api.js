// features/blog/services/blog.api.js
import axios from "@/shared/lib/axios";

export const fetchBlogs = (params) => {
  return axios.get("/blogs", { params });
};
