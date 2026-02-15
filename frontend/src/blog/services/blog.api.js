// features/blog/services/blog.api.js
import axiosClient from "../../utils/axiosClient";

export const fetchBlogs = (params) => {
  return axiosClient.get("/blog/feed", { params });
};


// export const getBlogs = async (params) => {
//   const { data } = await axios.get("/blogs", { params });
//   return data; 
// };

export const getBlogById = async (id) => {
  const { data } = await axiosClient.get(`blog/${id}`);
  return data.data;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await axiosClient.get(`/blog/slug/${slug}`);
  return data.data;
};
