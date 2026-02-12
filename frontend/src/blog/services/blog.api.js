// features/blog/services/blog.api.js
import axiosClient from "../../utils/axiosClient";

export const fetchBlogs = (params) => {
  return axiosClient.get("/blog/feed", { params });
};
