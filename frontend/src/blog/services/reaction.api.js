import axiosClient from "../../utils/axiosClient";

// services/reaction.api.js
export const reactOnBlog = ({ blogId, type }) => {
  return axiosClient.post(`/blogs/${blogId}/reaction`, { type });
};
